'use strict';

const now = new Date();
const daysAgo = (d) => new Date(now - d * 24 * 60 * 60 * 1000);

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'clients',
      [
        {
          names: 'Gasabo Constructors Ltd',
          email: 'procurement@gasabo.co.rw',
          phoneNumber: '+250781234567',
          address: 'Kacyiru',
          location: 'Kigali',
          status: true,
          createdAt: daysAgo(30),
          updatedAt: daysAgo(30),
        },
        {
          names: 'Nyabugogo Retailers',
          email: 'sales@nyabugogoretail.com',
          phoneNumber: '+250788998877',
          address: 'Nyabugogo Market',
          location: 'Kigali',
          status: true,
          createdAt: daysAgo(20),
          updatedAt: daysAgo(20),
        },
        {
          names: 'Muhanga Build Center',
          email: 'muhanga.build@gmail.com',
          phoneNumber: '+250782345678',
          address: 'Gitarama',
          location: 'Muhanga',
          status: true,
          createdAt: daysAgo(15),
          updatedAt: daysAgo(15),
        },
        {
          names: 'Rubavu Plumbers',
          email: 'rubavu.plumbers@yahoo.fr',
          phoneNumber: '+250785678901',
          address: 'Gisenyi Town',
          location: 'Rubavu',
          status: true,
          createdAt: daysAgo(5),
          updatedAt: daysAgo(5),
        },
      ],
      {}
    ),

  down: (queryInterface) =>
    queryInterface.bulkDelete('clients', null, {}),
};
