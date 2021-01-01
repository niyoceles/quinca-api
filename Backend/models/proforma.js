export default (sequelize, DataTypes) => {
  const proforma = sequelize.define(
    'proforma',
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
      itemsArray: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
        defaultValue: [],
      },
      pickupDate: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      deadline: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
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
      paymentType: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: 'unpaid',
        values: ['paypal', 'stripe', 'cash', 'unpaid'],
      },
    },
    {
      tableName: 'proforma',
      // paranoid: true,
    }
  );
  proforma.associate = (models) => {
    proforma.belongsTo(models.users, {
      as: 'client',
      foreignKey: 'clientId',
    });

    // proforma.belongsTo(models.items, {
    //   as: 'items',
    //   foreignKey: 'itemId',
    //   onDelete: 'CASCADE',
    // });
  };
  return proforma;
};
