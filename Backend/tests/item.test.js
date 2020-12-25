import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../../index';

chai.use(chaiHttp);
chai.should();
dotenv.config();

let authToken;
let itemId;
let itemOwnerId;
dotenv.config();

describe('CRUD Item routes', () => {
	// @user login
	it('should send back a token after sucessful login', done => {
		chai
			.request(app)
			.post('/api/user/login')
			.send({
				email: 'supersupplier@gmail.com',
				password: 'Password@123',
			})
			.then(res => {
				res.should.have.status(200);
				authToken = res.body.User.token; // get the token
				done();
			})
			.catch(err => done(err));
	});

	describe('create Item routes', () => {
		it('should not add item with invalid Token', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer wrong${authToken}`)
				.send({
					itemType: 'Finishing house',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('unauthorised to use this resource, please signup/login');
					done();
				});
		});

		it('should not add item with invalid item name', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemType: 'Finishing house',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item name is required');
					done();
				});
		});

		it('should not add item with invalid item image', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 101',
					itemType: 'Finishing house',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item image is required');
					done();
				});
		});

		it('should not add item with invalid item type', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item type is required');
					done();
				});
		});

		it('should not add item with invalid item Description', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('item description is required');
					done();
				});
		});

		it('should not add item with invalid item price', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'This an awesome room and soon',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Item price is required');
					done();
				});
		});

		it('should not add item with invalid item type', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('status is required');
					done();
				});
		});

		it('should add item with Valid input', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					itemId = res.body.item.id;
					itemOwnerId = res.body.item.itemOwnerId;
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have.property('item');
					res.body.should.have
						.property('message')
						.eql('item successful created');
					done();
				});
		});

		it('should not add item which is already exist ', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(403);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('this item already Exist');
					done();
				});
		});
	});

	// Update an item
	describe('Update Item routes', () => {
		it('should not update an item with invalid Token', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer wrong${authToken}`)
				.send({
					itemType: 'Finishing house',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('unauthorised to use this resource, please signup/login');
					done();
				});
		});

		it('should not update an item with invalid item id', done => {
			chai
				.request(app)
				.put(`/api/item/wrong${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Romm 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to update item');
					done();
				});
		});

		it('should not update item with invalid item name', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemType: 'Finishing house',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item name is required');
					done();
				});
		});

		it('should not update item with invalid item image', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 32',
					itemType: 'Finishing house',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item image is required');
					done();
				});
		});

		it('should not update item with invalid item type', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemDescription: 'This is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('item type is required');
					done();
				});
		});

		it('should not update item with invalid item Description', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('item description is required');
					done();
				});
		});

		it('should not update item with invalid item price', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'This an awesome room and soon',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Item price is required');
					done();
				});
		});

		it('should not update item with invalid item type', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('status is required');
					done();
				});
		});

		it('should update item with Valid input', done => {
			chai
				.request(app)
				.put(`/api/item/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send({
					itemName: 'Room 100',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('item updated successful');
					done();
				});
		});
	});

	// suspend an item
	describe('Suspend Item routes', () => {
		it('should not suspend an item with invalid Token', done => {
			chai
				.request(app)
				.patch(`/api/item/suspend/${itemId}`)
				.set('Authorization', `Bearer wrong${authToken}`)
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('unauthorised to use this resource, please signup/login');
					done();
				});
		});

		it('should not suspend item with invalid id', done => {
			chai
				.request(app)
				.patch('/api/item/suspend/hhhhh')
				.set('Authorization', `Bearer ${authToken}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to suspend item');
					done();
				});
		});

		it('should suspend an item with valid input', done => {
			chai
				.request(app)
				.patch(`/api/item/suspend/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('item suspended successful');
					done();
				});
		});
	});

	// activate an item
	describe('Activate Item routes', () => {
		it('should not activate an item with invalid Token', done => {
			chai
				.request(app)
				.patch(`/api/item/activate/${itemId}`)
				.set('Authorization', `Bearer wrong${authToken}`)
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('unauthorised to use this resource, please signup/login');
					done();
				});
		});

		it('should not activate item with invalid id', done => {
			chai
				.request(app)
				.patch('/api/item/activate/hhhhh')
				.set('Authorization', `Bearer ${authToken}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('Failed to activate an item');
					done();
				});
		});

		it('should activate an item with valid input', done => {
			chai
				.request(app)
				.patch(`/api/item/activate/${itemId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('item activated successful');
					done();
				});
		});
	});

	// get item by organization
	describe('Get Item by organization Item routes', () => {
		it('should not get items with invalid owner', done => {
			chai
				.request(app)
				.get(`/api/item/wrong${itemOwnerId}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to get items');
					done();
				});
		});

		it('should get items an item with valid input', done => {
			chai
				.request(app)
				.get(`/api/item/${itemOwnerId}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Get items successful');
					done();
				});
		});
	});

	// search item
	describe('Search Item routes', () => {
		it('should not get an item with invalid', done => {
			chai
				.request(app)
				.post('/api/item/search')
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to get items');
					done();
				});
		});

		it('should get search result items with valid existed items', done => {
			chai
				.request(app)
				.post('/api/item/search')
				.send({
					search: 'Room 100',
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Get items successful');
					done();
				});
		});
	});

	// get own items
	describe('Get own Item routes', () => {
		it('should not get own items with invalid token', done => {
			chai
				.request(app)
				.get('/api/item')
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('unauthorised to use this resource, please signup/login');
					done();
				});
		});

		it('should get own item with valid input', done => {
			chai
				.request(app)
				.get('/api/item')
				.set('Authorization', `Bearer ${authToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Get items successful');
					done();
				});
		});
	});
});
