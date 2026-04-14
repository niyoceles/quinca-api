import models from '../models';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';

const { users, items, clients, orders, proforma } = models;

class supplierController {
  static async getSuppliers(req, res) {
    try {
      const allsupplier = await users.findAll({
        where: {
          userType: 'supplier',
        },
      });
      if (allsupplier.length < 1) {
        return sendError(res, 'No supplier found', 404);
      }
      return sendSuccess(res, allsupplier, 'Get Supplier successful', 200, null, {
        allsupplier,
      });
    } catch (error) {
      return sendError(res, 'Failed to get supplier', 500, error.message);
    }
  }

  static async getMyCustomers(req, res) {
    try {
      const { userType, id } = req.decoded;

      if (userType === 'admin') {
        const allClients = await clients.findAll({
          include: [
            {
              model: orders,
              as: 'client',
              attributes: ['id', 'status', 'createdAt'],
            },
          ],
          order: [['names', 'ASC']],
        });
        return sendSuccess(res, allClients, 'All customers fetched successfully');
      }

      // Supplier logic: find clients who have items from this supplier in their requests
      const supplierItems = await items.findAll({
        where: { itemOwnerId: id },
        attributes: ['id'],
      });
      const supplierItemIds = supplierItems.map((item) => item.id);

      const customerEmails = new Set();

      // Check Orders
      const allOrders = await orders.findAll({ attributes: ['clientEmail', 'itemsArray'] });
      allOrders.forEach((order) => {
        const itemsInOrder = order.itemsArray || [];
        if (itemsInOrder.some((item) => supplierItemIds.includes(item.id))) {
          customerEmails.add(order.clientEmail);
        }
      });

      // Check Proformas
      const allProformas = await proforma.findAll({ attributes: ['clientEmail', 'itemsArray'] });
      allProformas.forEach((prof) => {
        const itemsInProf = prof.itemsArray || [];
        if (itemsInProf.some((item) => supplierItemIds.includes(item.id))) {
          customerEmails.add(prof.clientEmail);
        }
      });

      const uniqueEmails = Array.from(customerEmails);
      const myCustomers = await clients.findAll({
        where: { email: uniqueEmails },
        include: [
          {
            model: orders,
            as: 'client',
            attributes: ['id', 'status', 'createdAt'],
          },
        ],
      });

      return sendSuccess(res, myCustomers, 'Supplier customers fetched successfully');
    } catch (error) {
      return sendError(res, 'Failed to get customers', 500, error.message);
    }
  }

  static async myprofile(req, res) {
    try {
      const { id } = req.decoded;
      const myprofile = await users.findAll({
        where: {
          id,
        },
        include: [
          {
            as: 'items',
            model: items,
            attributes: [
              'itemImage',
              'itemName',
              'category',
              'itemPrice',
              'itemDescription',
              'id',
            ],
          },
        ],
      });
      if (myprofile.length < 1) {
        return sendError(res, 'my profile error', 404);
      }
      return sendSuccess(res, myprofile, 'Get profile successful', 200, null, {
        myprofile,
      });
    } catch (error) {
      return sendError(res, 'Failed to get my profile', 500, error.message);
    }
  }

  static async viewSupplierAccount(req, res) {
    try {
      const { id } = req.params;
      const profile = await users.findAll({
        where: {
          id,
        },
        include: [
          {
            as: 'items',
            model: items,
            attributes: [
              'itemImage',
              'itemName',
              'category',
              'itemPrice',
              'itemDescription',
              'id',
            ],
          },
        ],
      });
      if (profile.length < 1) {
        return sendError(res, 'profile error', 404);
      }
      return sendSuccess(res, profile, 'Get profile successful', 200, null, {
        profile,
      });
    } catch (error) {
      return sendError(res, 'Failed to get profile', 500, error.message);
    }
  }

  static async updateProfileImage(req, res) {
    const { profileImages } = req.body;
    try {
      const updateImages = await users.update(
        {
          profileImages,
        },
        {
          where: {
            id: req.decoded.id,
          },
        }
      );
      if (updateImages.length < 1) {
        return sendError(res, 'No updated image', 404);
      }
      return sendSuccess(res, null, 'Image updated successful');
    } catch (error) {
      return sendError(res, 'Failed to update image', 500, error.message);
    }
  }
}

export default supplierController;
