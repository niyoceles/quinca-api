module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    names: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      required: true,
      validate: {
        isEmail: true
      }
    },
    profile: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userType: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    nationalId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: true
    },
    birthDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    organization: {
      type: Sequelize.STRING,
      allowNull: true
    },
    profileImages: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    isVerified: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
