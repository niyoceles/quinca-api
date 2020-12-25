import chai, {
  expect
} from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import user from './dummies';

chai.use(chaiHttp);
chai.should();

describe('Supplier Routes', () => {
  describe('Supplier Routes Finishing house', () => {
    it('Supplier should signup supplier with hotes', (done) => {
      chai
        .request(app)
        .post('/api/user/supplier')
        .send(user.suppliers)
        .then((res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.equal(
            'Your account successful created'
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('should get suppliers if exist', (done) => {
      chai
        .request(app)
        .get('/api/supplier/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.have.property('message');
          res.body.should.have
            .property('message')
            .eql('Get supplier successful');
          done();
        });
    });
  });
});
