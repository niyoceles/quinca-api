module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('orders', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			clientId: {
				type: Sequelize.UUID,
				allowNull: false,
				required: true,
			},
			itemOwnerId: {
				type: Sequelize.UUID,
				allowNull: false,
				required: true,
			},
			itemId: {
				type: Sequelize.UUID,
				allowNull: true,
			},
			category: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			startDate: {
				type: Sequelize.STRING,
				allowNull: false,
				required: true,
			},
			endDate: {
				type: Sequelize.STRING,
				allowNull: false,
				required: true,
			},
			pickup: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			dropoff: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			status: {
				type: Sequelize.ENUM,
				allowNull: false,
				defaultValue: 'pending',
				values: ['active', 'confirmed', 'cancelled', 'pending'],
			},
			isPaid: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			amount: {
				type: Sequelize.DECIMAL(10, 2),
				defaultValue: 0.0,
				allowNull: false,
			},
			paymentType: {
				type: Sequelize.ENUM,
				allowNull: false,
				defaultValue: 'unpaid',
				values: ['unpaid', 'paypal', 'stripe', 'cash'],
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('orders'),
};
