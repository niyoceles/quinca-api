/* eslint-disable arrow-parens */
import models from '../models';
import itemService from '../services/itemServies';
import userService from '../services/userServices';
import proformaService from '../services/proformaServices';
import payWithStripe from '../services/stripe';

const {
  users, items, proforma, clients
} = models;

class orderController {
  // client order
  static async createProforma(req, res) {
    const {
      pickupDate,
      deadline,
      itemsArray,
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
        return res.status(401).json({
          error: 'Failed to create client',
        });
      }

      const newProforma = await proforma.create({
        clientEmail: userClient[0].email,
        itemsArray,
        pickupDate,
        deadline,
      });
      return res.status(201).json({
        newProforma,
        message: 'proforma successful created',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to request proforma',
      });
    }
  }

  static async getProforma(req, res) {
    try {
      const allproforma = await proforma.findAll({
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
      if (allproforma.length < 1) {
        return res.status(404).json({
          error: 'No proforma found',
        });
      }
      return res.status(200).json({
        allproforma,
        message: 'Get all proforma successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get all proforma',
      });
    }
  }

  static async getSingleProforma(req, res) {
    const {
      id
    } = req.params;
    try {
      const oneproforma = await proforma.findOne({
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
      if (oneproforma.length < 1) {
        return res.status(404).json({
          error: 'No proforma Item found',
        });
      }

      const proformaItem = oneproforma.itemsArray.map(async itemId => {
        const itemDetails = await items.findByPk(itemId.id);
        // const item = {
        //   itemPrice: itemDetails.itemPrice,
        //   itemName: itemDetails.itemName,
        // };

        return {
          itemDetails,
          // item1: await items.findOne({
          //   where: {
          //     id: itemId,
          //   },
          // }),
        };
      });

      const proformaItems = await Promise.all(proformaItem);
      return res.status(200).json({
        oneproforma,
        proformaItems,
        message: 'Get proforma item successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get proforma items',
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
        const orderedDetails = await proforma.findByPk(id);

        const payOrderedItem = await proformaService.payOrdered(
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
    // we will need another instruction here on cancel order
    const {
      orderedIdArray
    } = req.body;
    try {
      const orderedItem = orderedIdArray.map(async id => {
        const orderedDetails = await proforma.findByPk(id);

        const cancelOrderedItem = await proformaService.cancelOrdered(
          id,
          req.decoded.id
        );
        const item = await itemService.changeStatus(
          orderedDetails.itemId,
          true
        );
        return {
          cancelOrderedItem,
          item: await items.findOne({
            where: {
              id: item,
            },
          }),
        };
      });
      const cancelledOrder = await Promise.all(orderedItem);
      return res.status(200).json({
        cancelledOrder,
        message: 'Order cancelled successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to cancel order item',
      });
    }
  }

  // owner of item
  static async confirmOrder(req, res) {
    // confirming ordered will automatically reset order as it is paid
    const {
      orderedIdArray
    } = req.body;
    try {
      const orderedItem = orderedIdArray.map(async id => {
        const orderedDetails = await proforma.findByPk(id);

        const confirmOrderedItem = await proformaService.confirmOrdered(
          id,
          req.decoded.id
        );
        const item = await itemService.changeStatus(
          orderedDetails.itemId,
          false
        );
        return {
          confirmOrderedItem,
          item: await items.findOne({
            where: {
              id: item,
            },
          }),
        };
      });
      const confirmedOrder = await Promise.all(orderedItem);
      return res.status(200).json({
        confirmedOrder,
        message: 'Order confirmed successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to confirm order',
      });
    }
  }

  static async ourOrders(req, res) {
    try {
      const ourordered = await proforma.findAll({
        where: {
          itemOwnerId: req.decoded.id,
        },
      });
      if (ourordered.length < 1) {
        return res.status(404).json({
          error: 'No Ordered Item found',
        });
      }
      return res.status(200).json({
        ourordered,
        message: 'Get ordered successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get ordered items',
      });
    }
  }
}

export default orderController;
