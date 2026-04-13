'use strict';
const { v4: uuidv4 } = require('uuid');

const now = new Date();
const daysAgo = (d) => new Date(now - d * 24 * 60 * 60 * 1000);

const items1 = [{ itemName: 'Cement CIMERWA 50kg', itemPrice: 12500, quantity: 100, category: 'construction' }];
const items2 = [{ itemName: 'PVC Pipe 2 inch', itemPrice: 3500, quantity: 50, category: 'plumbing' }];
const items3 = [{ itemName: 'Iron Bars 12mm', itemPrice: 11000, quantity: 200, category: 'hardware' }];
const items4 = [
  { itemName: 'White Paint 20L', itemPrice: 45000, quantity: 5, category: 'paint' },
  { itemName: 'Paint Roller', itemPrice: 2000, quantity: 10, category: 'tools' }
];

const parseJsonArray = (arr, Sequelize) => {
  const elements = arr.map(item => `'${JSON.stringify(item).replace(/'/g, "''")}'::json`);
  return Sequelize.literal(`ARRAY[${elements.join(',')}]`);
};

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'orders',
      [
        {
          id: uuidv4(),
          clientEmail: 'procurement@gasabo.co.rw',
          itemsArray: parseJsonArray(items1, Sequelize),
          needDate: daysAgo(-5).toISOString(),
          deadline: daysAgo(-7).toISOString(),
          pickup: 'Kacyiru Site A',
          status: 'confirmed',
          isPaid: true,
          amount: 1250000.0,
          paymentType: 'stripe',
          createdAt: daysAgo(12),
          updatedAt: daysAgo(10),
        },
        {
          id: uuidv4(),
          clientEmail: 'procurement@gasabo.co.rw',
          itemsArray: parseJsonArray(items3, Sequelize),
          needDate: daysAgo(-2).toISOString(),
          deadline: daysAgo(-4).toISOString(),
          pickup: 'Kacyiru Site B',
          status: 'pending',
          isPaid: false,
          amount: 2200000.0,
          paymentType: 'unpaid',
          createdAt: daysAgo(2),
          updatedAt: daysAgo(2),
        },
        {
          id: uuidv4(),
          clientEmail: 'sales@nyabugogoretail.com',
          itemsArray: parseJsonArray(items4, Sequelize),
          needDate: daysAgo(-1).toISOString(),
          deadline: daysAgo(-3).toISOString(),
          dropoff: 'Nyabugogo Market Zone 1',
          status: 'active',
          isPaid: true,
          amount: 245000.0,
          paymentType: 'cash',
          createdAt: daysAgo(6),
          updatedAt: daysAgo(5),
        },
        {
          id: uuidv4(),
          clientEmail: 'rubavu.plumbers@yahoo.fr',
          itemsArray: parseJsonArray(items2, Sequelize),
          needDate: daysAgo(-10).toISOString(),
          deadline: daysAgo(-12).toISOString(),
          pickup: 'Gisenyi Store',
          status: 'cancelled',
          isPaid: false,
          amount: 175000.0,
          paymentType: 'unpaid',
          createdAt: daysAgo(15),
          updatedAt: daysAgo(14),
        },
        {
          id: uuidv4(),
          clientEmail: 'muhanga.build@gmail.com',
          itemsArray: parseJsonArray(items1, Sequelize),
          needDate: daysAgo(-1).toISOString(),
          deadline: daysAgo(-2).toISOString(),
          pickup: 'Muhanga Site',
          status: 'pending',
          isPaid: false,
          amount: 1250000.0,
          paymentType: 'unpaid',
          createdAt: daysAgo(1),
          updatedAt: daysAgo(1),
        },
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('orders', null, {}),
};
