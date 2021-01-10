module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('proforma', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    clientEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    itemsArray: {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: true,
      defaultValue: [],
    },
    pickupDate: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    deadline: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('proforma'),
};
