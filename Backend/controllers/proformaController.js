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
import { sendEmail } from '../helpers/mailHelper';
import { orderSummaryTemplate } from '../helpers/mailer/orderSummary';
import moment from 'moment';

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
      needDate, // Added for frontend compatibility
      deadline,
      itemsArray,
      names,
      email,
      phoneNumber,
      address,
      location,
    } = req.body;

    const finalPickupDate = needDate || pickupDate;

    if (!itemsArray || itemsArray.length === 0) {
      return sendError(res, 'Please add at least one material to your request', 400);
    }

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
        pickupDate: finalPickupDate,
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

      // Send Email to Client and Copy Paradise Bounty
      const totalAmount = itemsArray.reduce((acc, item) => acc + (Number(item.itemPrice) * (Number(item.itemNumber || item.quantity) || 1)), 0);
      const emailHtml = orderSummaryTemplate(
        names,
        email,
        phoneNumber,
        'Proforma',
        itemsArray,
        totalAmount,
        moment().format('MMMM Do YYYY, h:mm a')
      );

      try {
        await sendEmail({
          to: email,
          bcc: 'paradisebountyco@gmail.com',
          subject: `Hadiwa - New Proforma Request (#${newProforma.id})`,
          html: emailHtml
        });
      } catch (err) {
        console.error('Email notification failed but proforma was created:', err);
      }

      return sendSuccess(res, newProforma, 'proforma successful created', 201, null, {
        newProforma,
      });
    } catch (error) {
      return sendError(res, 'Failed to request proforma', 500, error.message);
    }
  }

  static async getProforma(req, res) {
    try {
      const { userType, id } = req.decoded;
      
      const allproforma = await proforma.findAll({
        include: [
          {
            model: clients,
            as: 'client',
            attributes: ['names', 'email', 'phoneNumber', 'address', 'location'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (allproforma.length < 1) {
        return sendSuccess(res, [], 'No proforma found', 200, null, { allproforma: [] });
      }

      if (userType === 'admin') {
        return sendSuccess(res, allproforma, 'Get all proforma successful', 200, null, {
          allproforma,
        });
      }

      // Supplier filtering
      // Fetch supplier's item IDs first
      const supplierItems = await items.findAll({
        where: { itemOwnerId: id },
        attributes: ['id'],
      });
      const supplierItemIds = supplierItems.map((item) => item.id);

      const filteredProformas = allproforma.filter((prof) => {
        // itemsArray is an array of objects like [{id: '...', quantity: ...}]
        const itemsInProforma = prof.itemsArray || [];
        return itemsInProforma.some((item) => supplierItemIds.includes(item.id));
      });

      return sendSuccess(res, filteredProformas, 'Supplier proformas fetched', 200, null, {
        allproforma: filteredProformas,
      });
    } catch (error) {
      return sendError(res, 'Failed to get proformas', 500, error.message);
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
    const { id } = req.body; // Try single ID first
    const { orderedIdArray } = req.body; // Then multiple
    const idsToCancel = id ? [id] : (orderedIdArray || []);

    try {
      const results = await Promise.all(idsToCancel.map(async (proformaId) => {
        const orderToCancel = await proforma.findOne({ where: { id: proformaId } });
        if (!orderToCancel) return null;

        const cancelled = await proformaService.cancelProforma(proformaId);
        if (cancelled) {
          const itemsArr = orderToCancel.itemsArray;
          if (itemsArr && Array.isArray(itemsArr)) {
            await Promise.all(itemsArr.map(async (item) => {
              await itemService.changeStatus(item.id, 'available');
            }));
          }
          return proformaId;
        }
        return null;
      }));

      const successfulIds = results.filter(r => r !== null);
      if (successfulIds.length === 0) {
        return sendError(res, 'Failed to cancel proforma(s)', 400);
      }
      return sendSuccess(res, successfulIds, 'Proforma(s) cancelled successful');
    } catch (error) {
      return sendError(res, 'Failed to cancel proforma', 500, error.message);
    }
  }

  static async confirmOrder(req, res) {
    const { id } = req.body;
    const { orderedIdArray } = req.body;
    const idsToConfirm = id ? [id] : (orderedIdArray || []);

    try {
      const results = await Promise.all(idsToConfirm.map(async (proformaId) => {
        const orderToConfirm = await proforma.findOne({ where: { id: proformaId } });
        if (!orderToConfirm) return null;

        const confirmed = await proformaService.confirmProforma(proformaId);
        if (confirmed) {
          const itemsArr = orderToConfirm.itemsArray;
          if (itemsArr && Array.isArray(itemsArr)) {
            await Promise.all(itemsArr.map(async (item) => {
              await itemService.changeStatus(item.id, 'booked');
            }));
          }
          return proformaId;
        }
        return null;
      }));

      const successfulIds = results.filter(r => r !== null);
      if (successfulIds.length === 0) {
        return sendError(res, 'Failed to confirm proforma(s)', 400);
      }
      return sendSuccess(res, successfulIds, 'Proforma(s) confirmed successful');
    } catch (error) {
      return sendError(res, 'Failed to confirm proforma', 500, error.message);
    }
  }
}

export default proformaController;
