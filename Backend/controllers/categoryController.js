import models from '../models';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';

const {
  categories, items, users
} = models;

class categoryController {
  static async createCategory(req, res) {
    const {
      name
    } = req.body;
    try {
      const checkCategoryExist = await categories.findOne({
        where: {
          name,
        },
      });

      if (checkCategoryExist) {
        return sendError(res, 'this categories already Exist', 403);
      }
      const newCategory = await categories.create({
        name,
      });

      if (newCategory) {
        return sendSuccess(res, newCategory, 'category successful created', 201, null, {
          category: newCategory,
        });
      }
    } catch (error) {
      return sendError(res, 'Failed to create an category', 500, error.message);
    }
  }

  static async suspendCategory(req, res) {
    const {
      id
    } = req.params;
    try {
      const suspendingCategory = await categories.update(
        {
          status: false,
        },
        {
          where: {
            id,
          },
        }
      );
      if (!suspendingCategory) {
        return res.status(404).json({
          error: 'Failed to suspend category',
        });
      }
      return res.status(200).json({
        message: 'category suspended successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to suspend category',
      });
    }
  }

  static async deleteCategory(req, res) {
    const {
      id
    } = req.params;
    try {
      const deletingCategory = await categories.destroy({
        where: {
          id,
        },
      });
      if (!deletingCategory) {
        return res.status(404).json({
          error: 'Failed to delete an category',
        });
      }
      return res.status(200).json({
        message: 'category deleted successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to delete category',
      });
    }
  }

  static async activateCategory(req, res) {
    const {
      id
    } = req.params;
    try {
      const activatingCategory = await categories.update(
        {
          status: true,
        },
        {
          where: {
            id,
          },
        }
      );
      if (!activatingCategory) {
        return res.status(404).json({
          error: 'Failed to this category an category',
        });
      }
      return res.status(200).json({
        message: 'category activated successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to activate an category',
      });
    }
  }

  static async allAvailbleCategories(req, res) {
    try {
      // @retrieve categories
      const allcategories = await categories.findAll({
        where: {
          status: true,
        },
      });
      if (allcategories.length < 1) {
        return sendError(res, 'No Category found', 404);
      }
      return sendSuccess(res, allcategories, 'Get categories successful', 200, null, {
        allcategories,
      });
    } catch (error) {
      return sendError(res, 'Failed to get categories', 500, error.message);
    }
  }

  // to get single category
  static async getCategory(req, res) {
    const {
      name
    } = req.params;
    try {
      const category = await categories.findAll({
        where: {
          name,
        },
        include: [
          {
            model: items,
            as: 'items',
            include: [
              {
                model: users,
                as: 'owner',
                attributes: ['organization', 'description', 'profile'],
              },
            ],
          },
        ],
      });
      if (category.length < 1) {
        return sendError(res, 'category not found', 404);
      }
      return sendSuccess(res, category, 'get category successful', 200, null, {
        category,
      });
    } catch (error) {
      return sendError(res, 'Failed to get an category', 500, error.message);
    }
  }
}

export default categoryController;
