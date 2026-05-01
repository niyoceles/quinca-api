import Sequelize from 'sequelize';
import models from '../models';
import {
  parsePagination,
  buildPaginationMeta,
} from '../helpers/pagination';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';
import redisClient from '../helpers/redis';
import { clearItemCache } from '../helpers/cacheHelper';

const {
  Op
} = Sequelize;
const {
  items,
  users,
} = models;



class itemController {
  static async createItem(req, res) {
    const {
      itemName,
      category,
      itemImage,
      itemImage2,
      itemDescription,
      itemPrice,
      status,
    } = req.body;

    try {
      const findUser = await users.findOne({
        where: {
          email: req.decoded.email,
          userType: 'supplier',
        },
      });

      if (!findUser) {
        return res.status(403).json({
          error: 'Forbidden: Only suppliers can register new materials',
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
          error: `The material "${itemName}" already exists in your inventory.`,
        });
      }
      const newItem = await items.create({
        itemName,
        itemImage,
        itemImage2,
        category,
        itemOwnerId: findUser.id,
        itemDescription,
        itemPrice,
        status,
      });

      if (newItem) {
        await clearItemCache();
        return sendSuccess(res, newItem, 'item successful created', 201, null, {
          item: newItem,
        });
      }
    } catch (error) {
      return sendError(res, 'Failed to create an item', 500, error.message);
    }
  }

  static async updateItem(req, res) {
    const {
      itemName,
      itemImage,
      itemImage2,
      category,
      itemDescription,
      itemPrice,
      status,
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
          category,
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
        return sendError(res, 'Failed to update item', 404);
      }
      await clearItemCache();
      const updatedItem = await items.findOne({
        where: { id },
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'description', 'profile'],
          },
        ],
      });
      return sendSuccess(res, updatedItem, 'item updated successful');
    } catch (error) {
      return sendError(res, 'Failed to update item', 500, error.message);
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
      const deletingItem = await items.destroy({
        where: {
          id,
          itemOwnerId: req.decoded.id,
        },
      });
      if (!deletingItem) {
        return sendError(res, 'Failed to delete an item', 404);
      }
      await clearItemCache();
      return sendSuccess(res, {
        id,
      }, 'item deleted successful');
    } catch (error) {
      return sendError(res, 'Failed to delete item', 500, error.message);
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
      const results = await items.findAll({
        where: {
          itemName: {
            [Op.like]: `%${search}%`,
          },
          status: true,
        },
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'description', 'profile'],
            where: { status: true },
          },
        ],
      });
      if (results.length < 1) {
        return sendError(res, 'No Item found', 404);
      }
      return sendSuccess(res, results, 'Get items successful', 200, null, {
        results,
      });
    } catch (error) {
      return sendError(res, 'Failed to get items', 500, error.message);
    }
  }

  static async allAvailableItems(req, res) {
    try {
      const {
        page,
        limit,
        offset,
      } = parsePagination(req.query);

      const cacheKey = `items_page_${page}_limit_${limit}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const {
          allitems,
          count,
        } = JSON.parse(cachedData);
        return sendSuccess(res, allitems, 'Get items successful (from cache)', 200, buildPaginationMeta(count, page, limit), {
          allitems,
        });
      }

      const {
        count,
        rows: allitems,
      } = await items.findAndCountAll({
        where: { status: true },
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'description', 'profile', 'status'],
            where: { status: true },
          },
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });

      if (allitems.length < 1) {
        return res.status(200).json({
          allitems: [],
          metadata: buildPaginationMeta(0, page, limit),
          message: 'No items found',
        });
      }

      await redisClient.setEx(cacheKey, 300, JSON.stringify({
        allitems,
        count,
      })); // 5 min TTL

      return sendSuccess(res, allitems, 'Get items successful', 200, buildPaginationMeta(count, page, limit), {
        allitems,
      });
    } catch (error) {
      return sendError(res, 'Failed to get items', 500, error.message);
    }
  }

  static async getHomeItems(req, res) {
    try {
      const cacheKey = 'home_items';
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const homeItems = JSON.parse(cachedData);
        return sendSuccess(res, homeItems, 'Get Home items successful (from cache)', 200, null, homeItems);
      }

      const construction = await items.findAll({
        where: {
          category: 'construction',
          status: true,
        },
        include: [{
          model: users,
          as: 'owner',
          where: { status: true },
          attributes: ['status'],
        }],
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 3,
      });
      const plumbing = await items.findAll({
        where: {
          category: 'plumbing',
          status: true,
        },
        include: [{
          model: users,
          as: 'owner',
          where: { status: true },
          attributes: ['status'],
        }],
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 4,
      });
      const electricity = await items.findAll({
        where: {
          category: 'electricity',
          status: true,
        },
        include: [{
          model: users,
          as: 'owner',
          where: { status: true },
          attributes: ['status'],
        }],
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8,
      });
      // if (!most) {
      //   return res.status(404).json({
      //     error: 'No Item most found',
      //   });
      // }
      const allHomeItems = {
        construction,
        plumbing,
        electricity,
      };

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(allHomeItems)); // 1 hour TTL

      return sendSuccess(res, allHomeItems, 'Get Home items successful', 200, null, {
        construction,
        plumbing,
        electricity,
      });
    } catch (error) {
      return sendError(res, 'Failed to get items', 500, error.message);
    }
  }

  // static async usedLater(req, res) {
  //   try {
  //     const thecategory = await categories.findAll();
  //     // console.log(thecategory.map(i=>i.name));
  //     // const category = thecategory.map((i) => i.name);

  //     const itemsByCategory = thecategory.map(async (id) => {
  //       const category = await items.findAll({
  //         where: {
  //           category: id.name
  //         }
  //       });
  //       return {
  //         category,
  //       };
  //     });

  //     // const most = await items.findAll({
  //     //   where: {
  //     //     category: 'most',
  //     //   },
  //     //   order: [['createdAt', 'DESC']],
  //     //   offset: (parseInt(1, 5) - 1) * 5,
  //     //   limit: 3,
  //     // });
  //     // const moderate = await items.findAll({
  //     //   where: {
  //     //     category: 'moderate',
  //     //   },
  //     //   order: [['createdAt', 'DESC']],
  //     //   offset: (parseInt(1, 5) - 1) * 5,
  //     //   limit: 4,
  //     // });
  //     // const low = await items.findAll({
  //     //   where: {
  //     //     category: 'low',
  //     //   },
  //     //   order: [['createdAt', 'DESC']],
  //     //   offset: (parseInt(1, 5) - 1) * 5,
  //     //   limit: 8,
  //     // });
  //     // if (!most) {
  //     //   return res.status(404).json({
  //     //     error: 'No Item most found',
  //     //   });
  //     // }
  //     const allitems = await Promise.all(itemsByCategory);
  //     return res.status(200).json({
  //       category: allitems.map((i) => i.category),
  //       message: 'Get Home items successful',
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: 'Failed to get items',
  //     });
  //   }
  // }

  // to get single item
  static async getItem(req, res) {
    const {
      id
    } = req.params;
    try {
      const item = await items.findOne({
        where: {
          id,
          status: true,
        },
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'description', 'profile', 'status'],
            where: { status: true },
          },
        ],
      });
      if (!item) {
        return res.status(404).json({
          error: 'item not found',
        });
      }
      return res.status(200).json({
        item,
        message: 'get item successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get an item',
      });
    }
  }

  static async relatedItems(req, res) {
    const {
      category
    } = req.params;
    try {
      const { page, limit, offset } = parsePagination(req.query);

      const { count, rows: relatedItems } = await items.findAndCountAll({
        where: {
          category,
          status: true,
        },
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'description', 'profile', 'status'],
            where: { status: true },
          },
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });

      if (relatedItems.length < 1) {
        return res.status(200).json({
          relatedItems: [],
          metadata: buildPaginationMeta(0, page, limit),
          message: 'No items found',
        });
      }

      return sendSuccess(res, relatedItems, 'Get related items item successful', 200, buildPaginationMeta(count, page, limit), {
        relatedItems,
      });
    } catch (error) {
      return sendError(res, 'Failed to get items', 500, error.message);
    }
  }

  static async GetMyItems(req, res) {
    try {
      const { userType, id } = req.decoded;
      const where = userType === 'admin' ? {} : { itemOwnerId: id };

      const myitems = await items.findAll({
        where,
        include: [
          {
            model: users,
            as: 'owner',
            attributes: ['organization', 'names', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!myitems || myitems.length === 0) {
        return sendSuccess(res, [], 'No items found', 200, null, { myitems: [] });
      }

      return sendSuccess(res, myitems, 'Items fetched successful', 200, null, {
        myitems,
      });
    } catch (error) {
      return sendError(res, 'Failed to get items', 500, error.message);
    }
  }
}

export default itemController;
