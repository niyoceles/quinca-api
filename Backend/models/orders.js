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
      clientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        references: {
          model: 'clients',
          key: 'email',
        },
      },

      itemsArray: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
        defaultValue: [],
      },

      needDate: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      deadline: {
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
    {
    }
  );
  orders.associate = (models) => {
    orders.belongsTo(models.clients, {
      as: 'client',
      foreignKey: 'clientEmail',
    });
  };
  return orders;
};
