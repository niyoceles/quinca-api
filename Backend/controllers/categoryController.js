import models from '../models';

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
        return res.status(403).json({
          error: 'this categories already Exist',
        });
      }
      const newCategory = await categories.create({
        name,
      });

      if (newCategory) {
        return res.status(200).json({
          category: newCategory,
          message: 'category successful created',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to create an category',
      });
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
        return res.status(404).json({
          error: 'No Category found',
        });
      }
      return res.status(200).json({
        allcategories,
        message: 'Get categorys successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get categorys',
      });
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
      if (!category) {
        return res.status(404).json({
          error: 'category not found',
        });
      }
      return res.status(200).json({
        category,
        message: 'get category successful',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to get an category',
      });
    }
  }
}

export default categoryController;
