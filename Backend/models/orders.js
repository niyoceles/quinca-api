export default (sequelize, DataTypes) => {
	const orders = sequelize.define(
		'orders',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			clientId: {
				type: DataTypes.UUID,
				allowNull: false,
				required: true,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			itemOwnerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			itemId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'items',
					key: 'id',
				},
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: 'items',
					key: 'category',
				},
			},
			startDate: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true,
			},
			endDate: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true,
			},
			pickup: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			dropoff: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM,
				allowNull: false,
				defaultValue: 'pending',
				values: ['active', 'confirmed', 'cancelled', 'pending'],
			},
			isPaid: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			amount: {
				type: DataTypes.DECIMAL(10, 2),
				defaultValue: 0.0,
				allowNull: false,
			},
			paymentType: {
				type: DataTypes.ENUM,
				allowNull: false,
				defaultValue: 'unpaid',
				values: ['paypal', 'stripe', 'cash', 'unpaid'],
			},
		},
		{}
	);
	orders.associate = models => {
		orders.belongsTo(models.users, {
			as: 'owner',
			foreignKey: 'itemOwnerId',
		});

		orders.belongsTo(models.users, {
			as: 'client',
			foreignKey: 'clientId',
		});

		orders.belongsTo(models.items, {
			as: 'items',
			foreignKey: 'itemId',
			onDelete: 'CASCADE',
		});
	};
	return orders;
};
