import dotenv from 'dotenv';

dotenv.config();

const clientUser = {
	id: 'db7b7393-e136-4727-bd22-1ef307244de7',
	email: 'admin3@gmail.com',
	names: 'celestin Niy',
	phoneNumber: '+250783067611',
	password: 'Password@123',
	userType: 'client',
	isVerified: true,
};

const supplierUser = {
	id: '11111',
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1034567890123456',
	phoneNumber: '+250700000000',
	email: 'supplier1@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Password@123',
};

const invalidNationalId = {
	names: 'Celestinhh  Niyonsaba',
	phoneNumber: '+250700000001',
	email: 'nationalid@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidOrganzation = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1214567890123456',
	phoneNumber: '+250700000003',
	email: 'organization@gmail.com',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidDescription = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1214567890123456',
	phoneNumber: '+250700000003',
	email: 'organization@gmail.com',
	organization: 'XYZ Ltd',
	country: 'Rwanda',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidCountry = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1294567890123456',
	phoneNumber: '+250700000004',
	email: 'country@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidState = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1284567890123456',
	phoneNumber: '+250700000005',
	email: 'state@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidCity = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1274567890123456',
	phoneNumber: '+250700000006',
	email: 'city@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali city',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidAddress = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1234567890123456',
	phoneNumber: '+250700000007',
	email: 'address@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali city',
	city: 'Kigali',
	location: 'Near police station',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidLocation = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1264567890123456',
	phoneNumber: '+250700000008',
	email: 'location@gmail.com',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali city',
	city: 'Kigali',
	address: 'Remera',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidSupplierEmail = {
	names: 'Celestinhh  Niyonsaba',
	nationalId: '1264566670123456',
	phoneNumber: '+250706000095',
	organization: 'XYZ Ltd',
	description: 'description of organization',
	country: 'Rwanda',
	state: 'Kigali city',
	city: 'Kigali',
	address: 'Remera',
	location: 'Kigali',
	birthDate: '1990',
	password: 'Kigali!123',
};

const invalidEmail = {
	email: 'celestin.gmail.com',
	names: 'Celestin Niyons',
	phoneNumber: '+250700000099',
	password: 'Celestin!123',
};

const invalidNnames = {
	names: '23',
	phoneNumber: '+250700000098',
	email: 'names@gmail.com',
	password: 'Celestin!123',
};

const invalidPhoneNumber = {
	phoneNumber: '+348',
	names: 'Celestin Niyons',
	email: 'phonenumber@gmail.com',
	password: 'Celestin!123',
};

const invalidPassword = {
	password: '12345',
	names: 'Celestin Niyonsaba',
	phoneNumber: '+250700000097',
	email: 'password@gmail.com',
};

const superClient = {
	email: 'superclient@gmail.com',
	password: 'Password@123',
};

// item dummies data
const correctItem = {
	itemName: 'Room 1',
	itemType: 'Finishing house',
	itemDescription: 'This is an awesome room',
	itemPrice: '300',
	status: true,
};

const suppliers = {
	names: 'Supplier  Niyonsaba',
	nationalId: '1234567890123056',
	phoneNumber: '+250783067614',
	email: 'niyoceles344@gmail.com',
	organization: 'XYZ Ltd',
	country: 'Rwanda',
	description: 'this is a material',
	state: 'Kigali ciy',
	city: 'Kigali',
	address: 'Remera',
	location: 'Near police station',
	birthDate: '1990',
	status: 'active',
	password: 'Kigali@123',
};

export default {
	clientUser,
	supplierUser,
	superClient,
	invalidEmail,
	invalidPassword,
	invalidPhoneNumber,
	invalidNnames,
	invalidAddress,
	suppliers,
	invalidCity,
	invalidNationalId,
	invalidOrganzation,
	invalidDescription,
	invalidState,
	invalidCountry,
	invalidLocation,
	invalidSupplierEmail,
	correctItem,
};
