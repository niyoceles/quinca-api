import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import models from '../models';
import app from '../../index';
import user from './dummies';

chai.use(chaiHttp);
chai.should();

const {
  users
} = models;
const {
  SECRET
} = process.env;

describe('Reset Password via email', () => {
  const wrongEmail = 'wrongemail@gmail.com';
  const newUserToken = jwt.sign({
    email: user.superClient.email
  }, SECRET, {
    expiresIn: '1d'
  });
  before(async () => {
    try {
      await users.destroy({
        where: {
          email: user.superClient.email,
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  });

  it('should not send an email when the email doesn\'t exist', (done) => {
    chai.request(app)
      .post('/api/user/reset-password')
      .send({
        email: wrongEmail,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.an('object');
        res.body.should.have.property('error');
        res.body.should.have.property('error').eql('The email provided does not exist');
        done();
      });
  });

  it('should send a reset password link when the email exist', (done) => {
    chai.request(app)
      .post('/api/user/reset-password')
      .set('Content-Type', 'application/json')
      .send({
        email: user.clientUser.email
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('message').eql('We have sent a password reset link to your email, Please check your email');
        done();
      });
  });

  it('should reset password and return a successful message', (done) => {
    chai.request(app)
      .put(`/api/user/reset-password/${newUserToken}`)
      .send({
        password: 'Password@124',
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('message').eql('You have successfully reset your password');
        done();
      });
  });

  it('should not reset password if the password is invalid', (done) => {
    chai.request(app)
      .put(`/api/user/reset-password/${newUserToken}`)
      .send({

      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not reset password if the token is invalid', (done) => {
    chai.request(app)
      .put(`/api/user/reset-password/eyey${newUserToken}`)
      .send({
        password: '!Mysecret@45',
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(403);
        res.should.be.an('object');
        res.body.should.have.property('error');
        res.body.should.have.property('error').eql('Permission to access this resource has been denied');
        done();
      });
  });
});
