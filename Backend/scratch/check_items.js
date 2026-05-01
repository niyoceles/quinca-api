const { items } = require('./models');
items.findAll({ where: { status: 'available' } })
  .then(all => {
    console.log('Available items count:', all.length);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
