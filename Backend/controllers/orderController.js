/* eslint-disable arrow-parens */
import models from '../models';
import itemService from '../services/itemServices';
import userService from '../services/userServices';
import orderService from '../services/orderServices';
import payWithStripe from '../services/stripe';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';
import {
  createAndEmitNotification
} from '../helpers/NotificationHelper';

const {
  items, orders, clients
} = models;

class orderController {
  // client order
  static async createOrder(req, res) {
    const {
      needDate,
      deadline,
      itemsArray,
      amount,
      names,
      email,
      phoneNumber,
      address,
      location,
    } = req.body;

    try {
      const userClient = await userService.createClient(
        names,
        email,
        phoneNumber,
        address,
        location
      );
      if (!userClient[0].email) {
        return sendError(res, 'Failed to create client', 401);
      }

      const order = await orders.create({
        clientEmail: userClient[0].email,
        itemsArray,
        needDate,
        deadline,
        amount,
      });

      // Notify Suppliers
      const supplierIdArray = await Promise.all(itemsArray.map(async (item) => {
        const itemRecord = await items.findByPk(item.id);
        return itemRecord && itemRecord.itemOwnerId ? itemRecord.itemOwnerId : null;
      }));

      const uniqueSupplierIds = [...new Set(supplierIdArray.filter((id) => id !== null))];

      await Promise.all(uniqueSupplierIds.map((supplierId) => createAndEmitNotification(
        supplierId,
        'New Order Received',
        `New order placed for your items. ID: ${order.id}`,
        'order'
      )));

      return sendSuccess(res, order, 'ordered successful created', 201, null, {
        order,
      });
    } catch (error) {
      return sendError(res, 'Failed to make order', 500, error.message);
    }
  }

  // static async myOrders(req, res) {
  //   try {
  //     const myordered = await orders.findAll({
  //       where: {
  //         id: req.decoded.id,
  //       },
  //     });
  //     if (myordered.length < 1) {
  //       return res.status(404).json({
  //         error: 'No Order Item found',
  //       });
  //     }
  //     return res.status(200).json({
  //       myordered,
  //       message: 'Get ordered successful',
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: 'Failed to get my order ordered items',
  //     });
  //   }
  // }

  static async getSingleOrder(req, res) {
    const {
      id
    } = req.params;
    try {
      const oneorder = await orders.findOne({
        where: {
          id,
        },
        include: [
          {
            model: clients,
            as: 'client',
            attributes: [
              'names',
              'email',
              'phoneNumber',
              'address',
              'location',
            ],
          },
        ],
      });
      if (oneorder.length < 1) {
        return res.status(404).json({
          error: 'No order found',
        });
      }

      const orderItem = oneorder.itemsArray.map(async itemId => {
        const itemDetails = await items.findByPk(itemId.id);

        return {
          itemDetails,
          // item1: await items.findOne({
          //   where: {
          //     id: itemId,
          //   },
          // }),
        };
      });

      const orderItems = await Promise.all(orderItem);
      return res.status(200).json({
        oneorder,
        orderItems,
        message: 'Get order item successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get ordered item',
      });
    }
  }

  static async getOrders(req, res) {
    try {
      const allorders = await orders.findAll({
        include: [
          {
            model: clients,
            as: 'client',
            attributes: [
              'names',
              'email',
              'phoneNumber',
              'address',
              'location',
            ],
          },
        ],
      });
      if (allorders.length < 1) {
        return res.status(404).json({
          error: 'No Order Item found',
        });
      }
      return res.status(200).json({
        allorders,
        message: 'Get ordered item successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get ordered item',
      });
    }
  }

  static async onlinePayment(req, res) {
    // not tested
    const {
      paymentType, orderedIdArray
    } = req.body;

    if (paymentType === 'stripe') {
      payWithStripe(req, res);
    }
    try {
      const orderedItem = orderedIdArray.map(async id => {
        const orderedDetails = await orders.findByPk(id);

        const payOrderedItem = await orderService.payOrdered(
          id,
          req.decoded.id,
          paymentType
        );
        const item = await itemService.changeStatus(
          orderedDetails.itemId,
          false
        );
        return {
          payOrderedItem,
          item: await items.findOne({
            where: {
              id: item,
            },
          }),
        };
      });
      const paidOrder = await Promise.all(orderedItem);
      return res.status(200).json({
        paidOrder,
        message: 'Order paid successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to pay order',
      });
    }
  }

  static async cancelOrder(req, res) {
    const { id } = req.body;
    const { orderedIdArray } = req.body;
    const idsToCancel = id ? [id] : (orderedIdArray || []);

    try {
      const results = await Promise.all(idsToCancel.map(async (orderId) => {
        const orderToCancel = await orders.findOne({ where: { id: orderId } });
        if (!orderToCancel) return null;

        const cancelled = await orderService.cancelOrdered(orderId);
        if (cancelled) {
          const itemsArr = orderToCancel.itemsArray;
          if (itemsArr && Array.isArray(itemsArr)) {
            await Promise.all(itemsArr.map(async (item) => {
              await itemService.changeStatus(item.id, 'available');
            }));
          }
          return orderId;
        }
        return null;
      }));

      const successfulIds = results.filter(r => r !== null);
      if (successfulIds.length === 0) {
        return res.status(400).json({ error: 'Failed to cancel order(s)' });
      }
      return res.status(200).json({ successfulIds, message: 'Order(s) cancelled successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to cancel order', details: error.message });
    }
  }

  // owner of item
  static async confirmOrder(req, res) {
    const { id } = req.body;
    const { orderedIdArray } = req.body;
    const idsToConfirm = id ? [id] : (orderedIdArray || []);

    try {
      const results = await Promise.all(idsToConfirm.map(async (orderId) => {
        const orderToConfirm = await orders.findOne({ where: { id: orderId } });
        if (!orderToConfirm) return null;

        const confirmed = await orderService.confirmOrdered(orderId);
        if (confirmed) {
          const itemsArr = orderToConfirm.itemsArray;
          if (itemsArr && Array.isArray(itemsArr)) {
            await Promise.all(itemsArr.map(async (item) => {
              await itemService.changeStatus(item.id, 'booked');
            }));
          }
          return orderId;
        }
        return null;
      }));

      const successfulIds = results.filter(r => r !== null);
      if (successfulIds.length === 0) {
        return res.status(400).json({ error: 'Failed to confirm order(s)' });
      }
      return res.status(200).json({ successfulIds, message: 'Order(s) confirmed successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to confirm order', details: error.message });
    }
  }

  static async ourOrders(req, res) {
    try {
      const { userType, id } = req.decoded || {};
      if (!userType) {
        return sendError(res, 'User type missing from token', 401);
      }

      console.log(`[ourOrders] Fetching orders for ${userType} (${id})`);

      const allorders = await orders.findAll({
        include: [
          {
            model: clients,
            as: 'client',
            attributes: ['names', 'email', 'phoneNumber', 'address', 'location'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!allorders || allorders.length < 1) {
        return sendSuccess(res, [], 'No Ordered Item found', 200, null, { allorders: [] });
      }

      if (userType === 'admin') {
        return sendSuccess(res, allorders, 'Get all orders successful', 200, null, {
          allorders,
        });
      }

      // Supplier filtering
      const supplierItems = await items.findAll({
        where: { itemOwnerId: id },
        attributes: ['id'],
      });
      const supplierItemIds = supplierItems.map((item) => item.id);

      const filteredOrders = allorders.filter((order) => {
        const itemsInOrder = order.itemsArray || [];
        if (!Array.isArray(itemsInOrder)) return false;
        return itemsInOrder.some((item) => supplierItemIds.includes(item.id));
      });

      return sendSuccess(res, filteredOrders, 'Supplier orders fetched', 200, null, {
        allorders: filteredOrders,
      });
    } catch (error) {
      console.error('[ourOrders] ERROR:', error);
      return sendError(res, 'Failed to get order', 500, error.message);
    }
  }
}

export default orderController;
