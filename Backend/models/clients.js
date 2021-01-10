export default (sequelize, DataTypes) => {
  const clients = sequelize.define(
    'clients',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
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
        primaryKey: true,
        required: true,
        validate: {
          isEmail: true,
        },
      },

      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        defaultValue: true,
      },
    },
    {
      tableName: 'clients',
      // paranoid: true,
    }
  );
  clients.associate = (models) => {
    clients.hasMany(models.orders, {
      as: 'client',
      foreignKey: 'clientEmail',
    });
    clients.hasMany(models.proforma, {
      as: 'clientproforma',
      foreignKey: 'clientEmail',
    });
  };
  return clients;
};
