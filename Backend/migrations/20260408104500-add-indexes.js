module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addIndex('items', ['category']),
      queryInterface.addIndex('items', ['itemOwnerId']),
      queryInterface.addIndex('items', ['status']),
      queryInterface.addIndex('orders', ['clientEmail'])
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeIndex('items', ['category']),
      queryInterface.removeIndex('items', ['itemOwnerId']),
      queryInterface.removeIndex('items', ['status']),
      queryInterface.removeIndex('orders', ['clientEmail'])
    ]);
  }
};
