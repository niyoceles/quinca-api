export default (sequelize, DataTypes) => {
  const categories = sequelize.define(
    'categories',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        unique: true,
        primaryKey: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
    }
  );
  categories.associate = (models) => {
    categories.hasMany(models.items, {
      as: 'items',
      foreignKey: 'category',
      onDelete: 'CASCADE',
    });
  };
  return categories;
};
