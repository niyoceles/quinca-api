'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Update the categories table: rename 'electricity' -> 'electrical'
    await queryInterface.sequelize.query(
      `UPDATE categories SET name = 'electrical' WHERE name = 'electricity';`
    );

    // 2. Update all existing items that have category = 'electricity'
    await queryInterface.sequelize.query(
      `UPDATE items SET category = 'electrical' WHERE category = 'electricity';`
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: revert 'electrical' -> 'electricity'
    await queryInterface.sequelize.query(
      `UPDATE categories SET name = 'electricity' WHERE name = 'electrical';`
    );
    await queryInterface.sequelize.query(
      `UPDATE items SET category = 'electricity' WHERE category = 'electrical';`
    );
  },
};
