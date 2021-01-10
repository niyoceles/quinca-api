module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('clients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    names: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      required: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('clients'),
};
