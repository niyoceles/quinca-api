/* eslint-disable class-methods-use-this */
import models from '../models';

const { orders } = models;
/**
 * item service
 */
class orderService {
	/**
	 * Change item status
	 *
	 * @param {email} logged email of the user
	 * @param {userType} type of the user client or supplier
	 * @returns {Object} item
	 */
	// cancel order
	async cancelOrdered(id) {
		const updatedBook = await orders.update(
			{
				status: 'cancelled',
			},
			{
				where: { id },
				returning: true,
			}
		);

		return updatedBook[0] > 0 ? updatedBook[1][0].id : null;
	}

	// confirm order services
	async confirmOrdered(id) {
		const updatedBook = await orders.update(
			{
				status: 'confirmed',
				isPaid: true,
				paymentType: 'cash',
			},
			{
				where: { id },
				returning: true,
			}
		);

		return updatedBook[0] > 0 ? updatedBook[1][0].id : null;
	}

	// payment ordered items
	async payOrdered(id, paymentType) {
		const paidOrder = await orders.update(
			{
				status: 'confirmed',
				isPaid: true,
				paymentType,
			},
			{
				where: { id },
				returning: true,
			}
		);

		return paidOrder[0] > 0 ? paidOrder[1][0].id : null;
	}
}

export default new orderService();
