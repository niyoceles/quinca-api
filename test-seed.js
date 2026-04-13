const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('quinca-store', 'postgres', '', { host: 'localhost', dialect: 'postgres' });

async function test() {
  try {
    await sequelize.getQueryInterface().bulkInsert('orders', [{
      id: 'db7b7393-e138-4727-bd22-1ef307244de0',
      clientEmail: 'procurement@gasabo.co.rw',
      itemsArray: [{ itemName: 'Cement' }],
      needDate: new Date().toISOString(),
      deadline: new Date().toISOString(),
      status: 'confirmed',
      isPaid: true,
      amount: 1000,
      paymentType: 'unpaid',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      itemsArray: { type: new Sequelize.ARRAY(Sequelize.JSON) }
    });
    console.log("SUCCESS with JS objects + ARRAY(JSON)");
  } catch (e) {
    console.error("ERROR passing JS objects:", e.message);
  }
}
test();
