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
    proforma.belongsTo(models.clients, {
      as: 'client',
      foreignKey: 'clientEmail',
    });
  };
  return proforma;
};
