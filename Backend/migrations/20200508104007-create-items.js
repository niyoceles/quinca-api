module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('items', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    itemName: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    itemImage: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    itemImage2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    itemType: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    itemOwnerId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    itemDescription: {
      type: Sequelize.STRING,
      allowNull: false
    },
    itemPrice: {
      type: Sequelize.STRING,
      allowNull: true,
      required: true
    },
    status: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('items')
};
