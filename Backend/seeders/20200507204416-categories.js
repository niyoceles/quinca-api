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
				name: 'electrical',
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
			{
				name: 'tools',
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
