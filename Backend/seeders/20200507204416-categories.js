module.exports = {
  up: (queryInterface, Sequelize) =>
	queryInterface.bulkInsert(
		'categories',
		[
			{
				name: 'construction',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
			{
				name: 'electricity',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
			{
				name: 'plumbing',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
		],
		{}
	),
  down: (queryInterface, Sequelize) =>
	queryInterface.bulkDelete('categories', null, {}),
};
