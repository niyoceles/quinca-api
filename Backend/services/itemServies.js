/* eslint-disable class-methods-use-this */
import models from '../models';

const {
  items,
} = models;
/**
 * item service
 */
class itemService {
  /**
   * Change item status
   *
   * @param {Number} itemId ID for the item
   * @param {String} status new item status
   * @returns {Object} item
   */
  async changeStatus(itemId, status) {
    const updatedItem = await items.update({
      status
    }, {
      where: {
        id: itemId
      },
      returning: true,
      raw: true,
      nest: true
    });

    return [updatedItem[1][0].id];
  }
}

export default new itemService();
