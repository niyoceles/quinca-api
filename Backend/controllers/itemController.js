import Sequelize from 'sequelize';
import models from '../models';

const { Op } = Sequelize;
const { items, users, categories } = models;

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
				category,
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
			itemName,
			itemImage,
			itemImage2,
			category,
			itemDescription,
			itemPrice,
			status,
		} = req.body;
		const { id } = req.params;

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
		const { id } = req.params;
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
		const { id } = req.params;
		try {
			const deletingItem = await items.destroy({
				where: {
					id,
					itemOwnerId: req.decoded.id,
				},
			});
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
		const { id } = req.params;
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
		const { search } = req.body;

		try {
			const results = await items.findAll({
				where: {
					itemName: {
						[Op.like]: `%${search}%`,
					},
				},
				include: [
					{
						model: users,
						as: 'owner',
						attributes: ['organization', 'description', 'profile'],
					},
				],
			});
			if (results.length < 1) {
				return res.status(404).json({
					error: 'No Item found',
				});
			}
			return res.status(200).json({
				results,
				message: 'Get items successful',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to get items',
			});
		}
	}

	static async allAvailbleItems(req, res) {
		try {
			// @pagination
			let page, limit;
			if (Object.keys(req.query).length === 0) {
				page = 1;
				limit = 20;
			} else if (req.query.limit === undefined) {
				({ page } = req.query);
				limit = 10;
			} else {
				({ page, limit } = req.query);
			}
			// @retrieve items
			const allitems = await items.findAll({
				include: [
					{
						model: users,
						as: 'owner',
						attributes: ['organization', 'description', 'profile'],
					},
				],
				order: [['createdAt', 'DESC']],
				offset: (parseInt(page, 20) - 1) * limit,
				limit,
			});
			if (allitems.length < 1) {
				return res.status(404).json({
					error: 'No Item found',
				});
			}
			return res.status(200).json({
				allitems,
				metadata: {
					currentPage: parseInt(page, 10),
					previousPage: parseInt(page, 10) > 1 ? parseInt(page, 10) - 1 : null,
					nextPage:
						Math.ceil(allitems.length / limit) > page
							? parseInt(page, 10) + 1
							: null,
					totalPages: Math.ceil(allitems.length / limit),
					limit: parseInt(limit, 10),
				},
				message: 'Get items successful',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to get items',
			});
		}
	}

	static async getHomeItems(req, res) {
		try {
			const construction = await items.findAll({
				where: {
					category: 'construction',
				},
				order: [['createdAt', 'DESC']],
				offset: (parseInt(1, 5) - 1) * 5,
				limit: 3,
			});
			const plumbing = await items.findAll({
				where: {
					category: 'plumbing',
				},
				order: [['createdAt', 'DESC']],
				offset: (parseInt(1, 5) - 1) * 5,
				limit: 4,
			});
			const electricity = await items.findAll({
				where: {
					category: 'electricity',
				},
				order: [['createdAt', 'DESC']],
				offset: (parseInt(1, 5) - 1) * 5,
				limit: 8,
			});
			// if (!most) {
			//   return res.status(404).json({
			//     error: 'No Item most found',
			//   });
			// }
			return res.status(200).json({
				construction,
				plumbing,
				electricity,
				message: 'Get Home items successful',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to get items',
			});
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
		const { id } = req.params;
		try {
			const item = await items.findOne({
				where: {
					id,
				},
				include: [
					{
						model: users,
						as: 'owner',
						attributes: ['organization', 'description', 'profile'],
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
		const { category } = req.params;
		try {
			// @pagination
			let page, limit;
			if (Object.keys(req.query).length === 0) {
				page = 1;
				limit = 20;
			} else if (req.query.limit === undefined) {
				({ page } = req.query);
				limit = 10;
			} else {
				({ page, limit } = req.query);
			}
			// @retrieve items
			const relatedItems = await items.findAll({
				where: {
					category,
				},
				include: [
					{
						model: users,
						as: 'owner',
						attributes: ['organization', 'description', 'profile'],
					},
				],
				order: [['createdAt', 'DESC']],
				offset: (parseInt(page, 20) - 1) * limit,
				limit,
			});
			if (relatedItems.length < 1) {
				return res.status(404).json({
					error: 'No Item found',
				});
			}
			return res.status(200).json({
				relatedItems,
				metadata: {
					currentPage: parseInt(page, 10),
					previousPage: parseInt(page, 10) > 1 ? parseInt(page, 10) - 1 : null,
					nextPage:
						Math.ceil(relatedItems.length / limit) > page
							? parseInt(page, 10) + 1
							: null,
					totalPages: Math.ceil(relatedItems.length / limit),
					limit: parseInt(limit, 10),
				},
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
