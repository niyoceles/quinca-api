const models = require('../models').default || require('../models');
const { orders, clients } = models;
orders.findAll({
  include: [
    {
      model: clients,
      as: 'client',
      attributes: ['names', 'email', 'phoneNumber', 'address', 'location'],
    },
  ],
})
  .then(all => {
    console.log('Orders with clients count:', all.length);
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED TO FETCH ORDERS:', err);
    process.exit(1);
  });
