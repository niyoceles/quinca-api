/* eslint-disable arrow-parens */
import models from '../models';
import itemService from '../services/itemServices';
import userService from '../services/userServices';
import proformaService from '../services/proformaServices';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';
import {
  createAndEmitNotification
} from '../helpers/NotificationHelper';

const {
  items,
  proforma,
  clients,
} = models;

class proformaController {
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
        return sendError(res, 'Failed to create client', 401);
      }

      const newProforma = await proforma.create({
        clientEmail: userClient[0].email,
        itemsArray,
        pickupDate,
        deadline,
      });

      // Notify Suppliers
      const supplierIdArray = await Promise.all(itemsArray.map(async (item) => {
        const itemRecord = await items.findByPk(item.id);
        return itemRecord && itemRecord.itemOwnerId ? itemRecord.itemOwnerId : null;
      }));

      const uniqueSupplierIds = [...new Set(supplierIdArray.filter((id) => id !== null))];

      await Promise.all(uniqueSupplierIds.map((supplierId) => createAndEmitNotification(
        supplierId,
        'Proforma Request',
        `A new proforma has been requested for your items. ID: ${newProforma.id}`,
        'proforma'
      )));

      return sendSuccess(res, newProforma, 'proforma successful created', 201, null, {
        newProforma,
      });
    } catch (error) {
      return sendError(res, 'Failed to request proforma', 500, error.message);
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
        return sendError(res, 'No proforma found', 404);
      }
      return sendSuccess(res, allproforma, 'Get all proforma successful', 200, null, {
        allproforma,
      });
    } catch (error) {
      return sendError(res, 'Failed to get all proforma', 500, error.message);
    }
  }

  static async getSingleProforma(req, res) {
    const { id } = req.params;
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
      if (!oneproforma) {
        return sendError(res, 'No proforma Item found', 404);
      }

      const proformaItem = oneproforma.itemsArray.map(async (itemId) => {
        const itemDetails = await items.findByPk(itemId.id);
        return {
          itemDetails,
        };
      });

      const proformaItems = await Promise.all(proformaItem);
      return sendSuccess(res, oneproforma, 'Get proforma item successful', 200, null, {
        oneproforma,
        proformaItems,
      });
    } catch (error) {
      return sendError(res, 'Failed to get proforma items', 500, error.message);
    }
  }

  static async getMyProforma(req, res) {
    try {
      const {
        email,
      } = req.decoded;
      const myproforma = await proforma.findAll({
        where: {
          clientEmail: email,
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
      if (myproforma.length < 1) {
        return sendError(res, 'No proforma found', 404);
      }
      return sendSuccess(res, myproforma, 'Get all proforma successful', 200, null, {
        myproforma,
      });
    } catch (error) {
      return sendError(res, 'Failed to get all proforma', 500, error.message);
    }
  }

  static async cancelOrder(req, res) {
    // we will need another instruction here on cancel order
    const { orderedIdArray } = req.body;
    try {
      const orderedItem = orderedIdArray.map(async (id) => {
        const orderedDetails = await proforma.findByPk(id);

        const cancelOrderedItem =
          await proformaService.cancelOrdered(
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
      return sendSuccess(res, cancelledOrder, 'Order cancelled successful');
    } catch (error) {
      return sendError(res, 'Failed to cancel order item', 500, error.message);
    }
  }

  // owner of item
  static async confirmOrder(req, res) {
    // confirming ordered will automatically reset order as it is paid
    const { orderedIdArray } = req.body;
    try {
      const orderedItem = orderedIdArray.map(async (id) => {
        const orderedDetails = await proforma.findByPk(id);

        const confirmOrderedItem =
          await proformaService.confirmOrdered(
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
      return sendSuccess(res, confirmedOrder, 'Order confirmed successful');
    } catch (error) {
      return sendError(res, 'Failed to confirm order', 500, error.message);
    }
  }
}

export default proformaController;
