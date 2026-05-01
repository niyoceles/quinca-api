const models = require('../models').default || require('../models');
const { orders } = models;
orders.findAll()
  .then(all => {
    console.log('Orders count:', all.length);
    if (all.length > 0) {
      console.log('First order:', JSON.stringify(all[0], null, 2));
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
