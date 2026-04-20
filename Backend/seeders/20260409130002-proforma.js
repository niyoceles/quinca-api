'use strict';
const { v4: uuidv4 } = require('uuid');

const now = new Date();
const daysAgo = (d) => new Date(now - d * 24 * 60 * 60 * 1000);

const items1 = [{ itemName: 'Roofing Sheets x100', expectedPrice: 8500 }];
const items2 = [{ itemName: 'Ceramic Tiles Box x50', expectedPrice: 15000 }];

const parseJsonArray = (arr, Sequelize) => {
  const elements = arr.map(item => `'${JSON.stringify(item).replace(/'/g, "''")}'::json`);
  return Sequelize.literal(`ARRAY[${elements.join(',')}]`);
};

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'proforma',
      [
        {
          id: uuidv4(),
          clientEmail: 'sales@nyabugogoretail.com',
          itemsArray: parseJsonArray(items1, Sequelize),
          pickupDate: daysAgo(-15).toISOString(),
          deadline: daysAgo(-10).toISOString(),
          status: 'pending',
          isPaid: false,
          paymentType: 'unpaid',
          createdAt: daysAgo(4),
          updatedAt: daysAgo(4),
        },
        {
          id: uuidv4(),
          clientEmail: 'muhanga.build@gmail.com',
          itemsArray: parseJsonArray(items2, Sequelize),
          pickupDate: daysAgo(-20).toISOString(),
          deadline: daysAgo(-18).toISOString(),
          status: 'confirmed',
          isPaid: false,
          paymentType: 'unpaid',
          createdAt: daysAgo(10),
          updatedAt: daysAgo(8),
        },
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('proforma', null, {}),
};
