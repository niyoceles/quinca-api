export default (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {});

  messages.associate = (models) => {
    messages.belongsTo(models.users, {
      foreignKey: 'senderId',
      as: 'sender',
      onDelete: 'CASCADE',
    });
    messages.belongsTo(models.users, {
      foreignKey: 'receiverId',
      as: 'receiver',
      onDelete: 'CASCADE',
    });
  };

  return messages;
};
