export default (sequelize, DataTypes) => {
	const items = sequelize.define(
		'items',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},

			itemName: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true,
			},

			itemImage: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true,
			},

			itemImage2: {
				type: DataTypes.STRING,
				allowNull: true,
			},

			itemType: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true,
			},
			itemOwnerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			itemDescription: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			itemPrice: {
				type: DataTypes.STRING,
				allowNull: true,
				required: true,
			},
			status: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{}
	);
	items.associate = models => {
		items.hasMany(models.orders, {
			foreignKey: 'itemId',
			onDelete: 'CASCADE',
		});
		items.belongsTo(models.users, {
			as: 'owner',
			foreignKey: 'itemOwnerId',
			onDelete: 'CASCADE',
		});
	};
	return items;
};
