import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../../index';

chai.use(chaiHttp);
chai.should();
dotenv.config();

let authTokenSupplier;
let authTokenClient;
let ownerItemId;
let itemId;
let orderId;
let itemId2;
let orderId2;
dotenv.config();

describe('Make order routes', () => {
	// @user login
	it('Supplier login', done => {
		chai
			.request(app)
			.post('/api/user/login')
			.send({
				email: 'supersupplier@gmail.com',
				password: 'Password@123',
			})
			.then(res => {
				res.should.have.status(200);
				authTokenSupplier = res.body.User.token; // get the token
				done();
			})
			.catch(err => done(err));
	});

	it('Client login', done => {
		chai
			.request(app)
			.post('/api/user/login')
			.send({
				email: 'superclient@gmail.com',
				password: 'Password@123',
			})
			.then(res => {
				res.should.have.status(200);
				authTokenClient = res.body.User.token; // get the token
				done();
			})
			.catch(err => done(err));
	});

	describe('create order routes', () => {
		it('supplier create an item', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.send({
					itemName: 'Room 999',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					itemId = res.body.item.id;
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

		it('supplier create another item', done => {
			chai
				.request(app)
				.post('/api/item')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.send({
					itemName: 'Room 888',
					itemImage: 'urlimage.jpg',
					itemType: 'Finishing house',
					itemDescription: 'this is an awesome room',
					itemPrice: '300',
					status: true,
				})
				.end((err, res) => {
					itemId2 = res.body.item.id;
					ownerItemId = res.body.item.itemOwnerId;
					res.should.have.status(200);
					done();
				});
		});

		it('should not order an item with invalid authentication', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.send({
					startDate: '2020-05-12',
					endDate: '2020-05-11',
					itemsArray: [itemId, itemId2],
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

		it('should not order an item with invalid item id', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					startDate: '2020-05-12',
					endDate: '2020-05-15',
				})
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to make order');
					done();
				});
		});

		it('should not add item with invalid starting date', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					endDate: '2020-05-15',
					itemsArray: [itemId, itemId2],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('starting date is required');
					done();
				});
		});

		it('should not add item with invalid end date', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					startDate: '2020-05-11',
					itemsArray: [itemId, itemId2],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('ending date is required');
					done();
				});
		});

		it('should order with valid input', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					startDate: '2020-05-12',
					endDate: '2020-05-15',
					itemsArray: [itemId],
				})
				.end((err, res) => {
					orderId = res.body.orderedItems.map(item => item.orderId);
					res.should.have.status(201);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('ordered successful created');
					done();
				});
		});

		it('should order another order with valid input', done => {
			chai
				.request(app)
				.post(`/api/order/${ownerItemId}`)
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					startDate: '2020-05-17',
					endDate: '2020-05-19',
					itemsArray: [itemId2],
				})
				.end((err, res) => {
					orderId2 = res.body.orderedItems.map(item => item.orderId);
					res.should.have.status(201);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('ordered successful created');
					done();
				});
		});
	});

	// get my orders
	describe('Get my order as client routes', () => {
		it('Should not get order without authentication', done => {
			chai
				.request(app)
				.get('/api/order')
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

		it('Should not get order if not exist', done => {
			chai
				.request(app)
				.get('/api/order')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.end((err, res) => {
					res.should.have.status(404);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('No Order Item found');
					done();
				});
		});

		it('Get my order', done => {
			chai
				.request(app)
				.get('/api/order')
				.set('Authorization', `Bearer ${authTokenClient}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('Get ordered successful');
					done();
				});
		});
	});

	// get orders for supplier
	describe('Get my order as supplier routes', () => {
		it('Should not get order without authentication', done => {
			chai
				.request(app)
				.get('/api/order/supplier')
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

		it('Should not get ordered if not exist', done => {
			chai
				.request(app)
				.get('/api/order/supplier')
				.set('Authorization', `Bearer ${authTokenClient}`)
				.end((err, res) => {
					res.should.have.status(404);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('No Ordered Item found');
					done();
				});
		});

		it('Get my order by supplier', done => {
			chai
				.request(app)
				.get('/api/order/supplier')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('Get ordered successful');
					done();
				});
		});
	});

	describe('Client Cancel Order ', () => {
		it('Should not cancel order without authentication', done => {
			chai
				.request(app)
				.delete('/api/order')
				.send({
					orderedIdArray: orderId,
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

		it('Should not cancel order if not exist', done => {
			chai
				.request(app)
				.delete('/api/order')
				.set('Authorization', `Bearer ${authTokenClient}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have
						.property('error')
						.eql('Failed to cancel order item');
					done();
				});
		});

		it('should cancel order with valid input', done => {
			chai
				.request(app)
				.delete('/api/order')
				.set('Authorization', `Bearer ${authTokenClient}`)
				.send({
					orderedIdArray: orderId,
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('Order cancelled successful');
					done();
				});
		});
	});

	describe('supplier Confirm Order ', () => {
		it('Should not confirm order without authentication', done => {
			chai
				.request(app)
				.patch('/api/order')
				.send({
					orderedIdArray: orderId2,
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

		it('Should not confirm order if not exist', done => {
			chai
				.request(app)
				.patch('/api/order')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.should.be.an('object');
					res.body.should.have.property('error');
					res.body.should.have.property('error').eql('Failed to confirm order');
					done();
				});
		});

		it('should confirm order with valid input', done => {
			chai
				.request(app)
				.patch('/api/order')
				.set('Authorization', `Bearer ${authTokenSupplier}`)
				.send({
					orderedIdArray: orderId2,
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.an('object');
					res.body.should.have.property('message');
					res.body.should.have
						.property('message')
						.eql('Order confirmed successful');
					done();
				});
		});
	});
});
