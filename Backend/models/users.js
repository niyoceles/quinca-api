export default (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      names: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
    }
  );
  users.associate = (models) => {
    users.hasMany(models.items, {
      as: 'items',
      foreignKey: 'itemOwnerId',
      sourceKey: 'id',
    });
  };
  return users;
};
