/* eslint-disable arrow-parens */
import models from '../models';
import itemService from '../services/itemServies';
import userService from '../services/userServices';
import orderService from '../services/orderServices';
import payWithStripe from '../services/stripe';

const { users, items, orders } = models;

class orderController {
	// client order
	static async createOrder(req, res) {
		const { itemOwnerId } = req.params;

		const { startDate, endDate, itemsArray, itemType } = req.body;

		try {
			const userClient = await userService.checkingUser(
				req.decoded.email,
				'client'
			);
			if (!userClient) {
				return res.status(401).json({
					error: 'Not Authorized to make order, Please signup as client',
				});
			}

			const orderItem = itemsArray.map(async itemId => {
				const itemDetails = await items.findByPk(itemId);
				const arrivalDateObj = new Date(startDate);
				const leavingDateObj = new Date(endDate);
				const duration = Math.round(
					(leavingDateObj - arrivalDateObj) / (24 * 3600 * 1000)
				);
				const amount = duration * itemDetails.itemPrice;

				const order = await orders.create({
					clientId: userClient.id,
					itemOwnerId,
					itemId,
					itemType,
					startDate,
					endDate,
					amount,
				});
				const item = await itemService.changeStatus(itemId, false);

				return {
					orderId: order.id,
					item: await items.findOne({
						where: {
							id: item,
						},
					}),
				};
			});

			const orderedItems = await Promise.all(orderItem);
			return res.status(201).json({
				orderedItems,
				message: 'ordered successful created',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to make order',
			});
		}
	}

	static async myOrders(req, res) {
		try {
			const myordered = await orders.findAll({
				where: {
					clientId: req.decoded.id,
				},
				include: [
					{
						model: items,
						as: 'items',
						attributes: [
							'itemPrice',
							'itemType',
							'itemName',
							'itemImage',
							'id',
						],
						include: [
							{
								model: users,
								as: 'owner',
								attributes: [
									'names',
									'email',
									'phoneNumber',
									'organization',
									'state',
									'city',
									'address',
									'id',
								],
							},
						],
					},
				],
			});
			if (myordered.length < 1) {
				return res.status(404).json({
					error: 'No Order Item found',
				});
			}
			return res.status(200).json({
				myordered,
				message: 'Get ordered successful',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to get ordered items',
			});
		}
	}

	static async getOrder(req, res) {
		const { id } = req.params;
		try {
			const orderedItem = await orders.findAll({
				where: {
					id,
				},
				include: [
					{
						model: items,
						as: 'items',
						attributes: [
							'itemPrice',
							'itemType',
							'itemName',
							'itemImage',
							'id',
						],
						include: [
							{
								model: users,
								as: 'owner',
								attributes: [
									'names',
									'email',
									'phoneNumber',
									'organization',
									'state',
									'city',
									'address',
									'id',
								],
							},
						],
					},
				],
			});
			if (orderedItem.length < 1) {
				return res.status(404).json({
					error: 'No Order Item found',
				});
			}
			return res.status(200).json({
				orderedItem,
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
		const { paymentType, orderedIdArray } = req.body;

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
		// we will need another instruction here on cancel order
		const { orderedIdArray } = req.body;
		try {
			const orderedItem = orderedIdArray.map(async id => {
				const orderedDetails = await orders.findByPk(id);

				const cancelOrderedItem = await orderService.cancelOrdered(
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
		const { orderedIdArray } = req.body;
		try {
			const orderedItem = orderedIdArray.map(async id => {
				const orderedDetails = await orders.findByPk(id);

				const confirmOrderedItem = await orderService.confirmOrdered(
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
			const ourordered = await orders.findAll({
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
