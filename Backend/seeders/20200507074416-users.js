export const up = (queryInterface, Sequelize) =>
	queryInterface.bulkInsert(
		'users',
		[
			{
				id: 'db7b7393-e136-4727-bd22-1ef307244de9',
				email: 'superclient@gmail.com',
				names: 'super client',
				phoneNumber: '+250783067000',
				password:
					'$2a$10$9Nlgh1Kxat6d2bkVk5zfcOFerh/I7S0G268uwNxsem1LSTB18QU6O',
				status: true,
				userType: 'client',
				isVerified: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
			{
				id: 'db7b7393-e138-4727-bd22-1ef307244de9',
				email: 'paradisebountyco@gmail.com',
				nationalId: '1199567890123456',
				names: 'PARADI-BOUNTY Co. LTD',
				phoneNumber: '+250788550184',
				password:
					'$2a$10$9Nlgh1Kxat6d2bkVk5zfcOFerh/I7S0G268uwNxsem1LSTB18QU6O',
				status: true,
				organization: 'PARADI-BOUNTY Co. LTD',
				birthDate: '1990',
				country: 'Rwanda',
				state: 'Kigali ciy',
				city: 'Kigali',
				address: 'Gisozi',
				location: 'Umukindo complex',
				userType: 'supplier',
				isVerified: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
			{
				id: 'db7b7393-e138-4727-bd44-1ef307244de9',
				email: 'niyoceles3@gmail.com',
				nationalId: '1199567890933456',
				names: 'Celestin N',
				phoneNumber: '+250783067012',
				password:
					'$2a$10$9Nlgh1Kxat6d2bkVk5zfcOFerh/I7S0G268uwNxsem1LSTB18QU6O',
				status: true,
				organization: 'CARS COMMUNITY',
				birthDate: '1990',
				country: 'Rwanda',
				state: 'Kigali ciy',
				city: 'Kigali',
				address: 'Remera',
				location: 'Near police station',
				userType: 'admin',
				isVerified: true,
				createdAt: '2020-05-07 09:37:12.509+02',
				updatedAt: '2020-05-08 09:37:12.509+02',
			},
		],
		{}
	);
export const down = (queryInterface, Sequelize) =>
	queryInterface.bulkDelete('users', null, {});
