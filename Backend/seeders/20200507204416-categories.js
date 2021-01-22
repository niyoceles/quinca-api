export const up = (queryInterface, Sequelize) =>
	queryInterface.bulkInsert(
		'categories',
		[
			{
				id: 1,
				name: 'construction',
				status: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
			{
				id: 2,
				name: 'electricity',
				status: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
			{
				id: 3,
				name: 'plumbing',
				status: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
		],
		{}
	);
export const down = (queryInterface, Sequelize) =>
	queryInterface.bulkDelete('categories', null, {});
