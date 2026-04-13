'use strict';
const { v4: uuidv4 } = require('uuid');

// Seeded user IDs from 20200507074416-users.js
const CLIENT_ID  = 'db7b7393-e136-4727-bd22-1ef307244de9'; // super client
const SUPPLIER_ID = 'db7b7393-e138-4727-bd22-1ef307244de9'; // PARADI-BOUNTY Co. LTD

const now = new Date();
const minutesAgo = (m) => new Date(now - m * 60000);

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('messages', [
      {
        id: uuidv4(),
        senderId: CLIENT_ID,
        receiverId: SUPPLIER_ID,
        text: 'Hello, I wanted to ask about your cement stock.',
        isRead: true,
        createdAt: minutesAgo(60),
        updatedAt: minutesAgo(60),
      },
      {
        id: uuidv4(),
        senderId: SUPPLIER_ID,
        receiverId: CLIENT_ID,
        text: 'Hi! Yes, we have 500 bags of Portland cement available.',
        isRead: true,
        createdAt: minutesAgo(58),
        updatedAt: minutesAgo(58),
      },
      {
        id: uuidv4(),
        senderId: CLIENT_ID,
        receiverId: SUPPLIER_ID,
        text: 'Is the cement still available in bulk? I need at least 300 bags.',
        isRead: true,
        createdAt: minutesAgo(55),
        updatedAt: minutesAgo(55),
      },
      {
        id: uuidv4(),
        senderId: SUPPLIER_ID,
        receiverId: CLIENT_ID,
        text: 'Yes, we can arrange that. Would you like a proforma invoice?',
        isRead: true,
        createdAt: minutesAgo(50),
        updatedAt: minutesAgo(50),
      },
      {
        id: uuidv4(),
        senderId: CLIENT_ID,
        receiverId: SUPPLIER_ID,
        text: 'That would be great! Please include delivery to Kicukiro.',
        isRead: false,
        createdAt: minutesAgo(2),
        updatedAt: minutesAgo(2),
      },
    ], {}),

  down: (queryInterface) =>
    queryInterface.bulkDelete('messages', null, {}),
};
