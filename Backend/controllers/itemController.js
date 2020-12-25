import Sequelize from 'sequelize';
import models from '../models';

const {
  Op
} = Sequelize;
const {
  items, users
} = models;

class itemController {
  static async createItem(req, res) {
    const {
      itemName, itemType, itemImage, itemImage2, itemDescription, itemPrice, status
    } = req.body;

    try {
      const findUser = await users.findOne({
        where: {
          email: req.decoded.email,
          userType: 'supplier',
        },
      });

      if (!findUser) {
        return res.status(401).json({
          error: 'Not Authorized to create an Item',
        });
      }

      const checkItemExist = await items.findOne({
        where: {
          itemOwnerId: findUser.id,
          itemName,
        },
      });

      if (checkItemExist) {
        return res.status(403).json({
          error: 'this item already Exist',
        });
      }
      const newItem = await items.create({
        itemName,
        itemImage,
        itemImage2,
        itemType,
        itemOwnerId: findUser.id,
        itemDescription,
        itemPrice,
        status,
      });

      if (newItem) {
        return res.status(200).json({
          item: newItem,
          message: 'item successful created',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to create an item',
      });
    }
  }

  static async updateItem(req, res) {
    const {
      itemName, itemImage, itemImage2, itemType, itemDescription, itemPrice, status
    } = req.body;
    const {
      id
    } = req.params;

    try {
      const updatingItem = await items.update(
        {
          itemName,
          itemImage,
          itemImage2,
          itemType,
          itemDescription,
          itemPrice,
          status,
        },
        {
          where: {
            id,
            itemOwnerId: req.decoded.id,
          },
        }
      );
      if (!updatingItem) {
        return res.status(404).json({
          error: 'Failed to update item',
        });
      }
      return res.status(200).json({
        message: 'item updated successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update item',
      });
    }
  }

  static async suspendItem(req, res) {
    const {
      id
    } = req.params;
    try {
      const suspendingItem = await items.update(
        {
          status: false,
        },
        {
          where: {
            id,
            itemOwnerId: req.decoded.id,
          },
        }
      );
      if (!suspendingItem) {
        return res.status(404).json({
          error: 'Failed to suspend item',
        });
      }
      return res.status(200).json({
        message: 'item suspended successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to suspend item',
      });
    }
  }

  static async deleteItem(req, res) {
    const {
      id
    } = req.params;
    try {
      const deletingItem = await items.destroy(
        {
          where: {
            id,
            itemOwnerId: req.decoded.id,
          },
        }
      );
      if (!deletingItem) {
        return res.status(404).json({
          error: 'Failed to delete an item',
        });
      }
      return res.status(200).json({
        message: 'item deleted successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to delete item',
      });
    }
  }

  static async activateItem(req, res) {
    const {
      id
    } = req.params;
    try {
      const activatingItem = await items.update(
        {
          status: true,
        },
        {
          where: {
            id,
            itemOwnerId: req.decoded.id,
          },
        }
      );
      if (!activatingItem) {
        return res.status(404).json({
          error: 'Failed to this item an item',
        });
      }
      return res.status(200).json({
        message: 'item activated successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to activate an item',
      });
    }
  }

  static async searchItem(req, res) {
    const {
      search
    } = req.body;

    try {
      const searchResult = await items.findAll({
        where: {
          [Op.or]: [
            {
              itemName: search,
            },
            {
              itemPrice: search,
            },
            {
              itemDescription: search,
            },
          ],
        },
        include: [{
          model: users,
          as: 'owner',
          attributes: ['organization', 'description', 'profile']
        }]
      });
      if (!searchResult) {
        return res.status(404).json({
          error: 'Not found items',
        });
      }
      if (searchResult.length < 1) {
        return res.status(404).json({
          error: 'No Item found',
        });
      }
      return res.status(200).json({
        searchResult,
        message: 'Get items successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get items',
      });
    }
  }

  static async allByOrganization(req, res) {
    const {
      itemOwnerId
    } = req.params;
    try {
      const allitems = await items.findAll({
        where: {
          itemOwnerId,
        },
        include: [{
          model: users,
          as: 'owner',
          attributes: ['organization', 'description', 'profile']
        }]
      });
      if (allitems.length < 1) {
        return res.status(404).json({
          error: 'No Item found',
        });
      }
      return res.status(200).json({
        allitems,
        message: 'Get items successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get items',
      });
    }
  }

  static async GetMyItems(req, res) {
    try {
      const myitems = await items.findAll({
        where: {
          itemOwnerId: req.decoded.id,
        },
      });
      if (!myitems) {
        return res.status(404).json({
          error: 'No Item found',
        });
      }
      return res.status(200).json({
        myitems,
        message: 'Get items successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get items',
      });
    }
  }
}

export default itemController;
