import chai, {
  expect
} from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../../index';
import user from './dummies';
import db from '../models';
import Auth from '../helpers/Auth';

chai.use(chaiHttp);

dotenv.config();

const {
  id, names, email, userType
} = user.clientUser;
const correctToken = Auth.generateToken(id, email, names, userType);

describe('Client Authentication', () => {
  before(() => {
    db.users.destroy({
      where: {
        email: user.clientUser.email,
      },
    });
  });

  it('should signup user with Invalid Passwoed', (done) => {
    chai
      .request(app)
      .post('/api/user')
      .send(user.invalidPassword)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('should signup user with Invalid Names', (done) => {
    chai
      .request(app)
      .post('/api/user')
      .send(user.invalidNnames)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('should signup user with Invalid Phone number', (done) => {
    chai
      .request(app)
      .post('/api/user')
      .send(user.invalidPhoneNumber)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('should signup user with valid crendentials', (done) => {
    chai
      .request(app)
      .post('/api/user')
      .send(user.clientUser)
      .then((res) => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.equal('Your account successful created');
        done();
      })
      .catch((err) => done(err));
  });

  it('should Not signup user with valid Account already exist', (done) => {
    chai
      .request(app)
      .post('/api/user')
      .send(user.clientUser)
      .then((res) => {
        expect(res.statusCode).to.be.equal(403);
        expect(res.body).to.be.an('object');
        done();
      })
      .catch((err) => done(err));
  });

  it('Get Token', () => {
    chai
      .request(app)
      .get(`/api/user/get/${correctToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        // done();
      });
    //   .catch((err) => done(err));
  });

  it('Failed to Verify an account', (done) => {
    chai
      .request(app)
      .get(
        '/api/user/verify/eyvhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiN2I3MzkzLWUxMzYtNDcyNy1iZDIyLTFlZjMwNzI0NGRlOSIsImVtYWlsIjoic3VwZXJjbGllbnRAZ21haWwuY29tIiwibmFtZXMiOiJzdXBlciBjbGllbnQiLCJ1c2VyVHlwZSI6ImNsaWVudCIsImlhdCI6MTU4ODgzOTI2OCwiZXhwIjoxNTg4OTI1NjY4fQ.wV-vE2sfdm-7B9mUI6W3aoSSnRmt2DmP24Yj4rJRu04'
      )
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(500);
      });
    done();
  });
});

describe('Supplier Authentication', () => {
  before(() => {
    db.users.destroy({
      where: {
        email: user.supplierUser.email,
      },
    });
  });

  it('Supplier should signup supplier with Invalid email', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidSupplierEmail)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should signup supplier with Invalid Password', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidPassword)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should signup supplier with Invalid Names', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidNnames)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should signup supplier with Invalid organization name', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidOrganzation)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should signup supplier with Invalid Description', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidDescription)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid National Id', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidNationalId)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid Country', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidCountry)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid State', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidState)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid City', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidCity)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid Address', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidAddress)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid Location', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidLocation)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should not signup supplier with Invalid Phone number', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.invalidPhoneNumber)
      .then((res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should signup supplier with valid crendentials', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.supplierUser)
      .then((res) => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.equal('Your account successful created');
        done();
      })
      .catch((err) => done(err));
  });

  it('Supplier should Not signup supplier with valid Account already exist', (done) => {
    chai
      .request(app)
      .post('/api/user/supplier')
      .send(user.supplierUser)
      .then((res) => {
        expect(res.statusCode).to.be.equal(403);
        expect(res.body).to.be.an('object');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('User signin', () => {
  it('should not login user with unregistered account', (done) => {
    chai
      .request(app)
      .post('/api/user/login')
      .send({
        email: 'usernotfound@gmail.com',
        password: 'Alpha123$111xxxx',
      })
      .then((res) => {
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.error).to.be.equal('user not found');
        done();
      })
      .catch((err) => done(err));
  });
  it('should not login user with invalid password', (done) => {
    chai
      .request(app)
      .post('/api/user/login')
      .send({
        email: user.clientUser.email,
        password: 'Alpha123$111xxxxzzzz',
      })
      .then((res) => {
        expect(res.statusCode).to.be.equal(401);
        expect(res.body.error).to.be.equal('Email and Password are not match');
        done();
      })
      .catch((err) => done(err));
  });

  it('should not login user with unverified account', (done) => {
    chai
      .request(app)
      .post('/api/user/login')
      .send({
        email: user.supplierUser.email,
        password: user.supplierUser.password,
      })
      .then((res) => {
        expect(res.statusCode).to.be.equal(401);
        expect(res.body.error).to.be.equal(
          'your account is not verified, Please verify your account'
        );
        done();
      })
      .catch((err) => done(err));
  });
  it('User should login with valid email and password', (done) => {
    chai
      .request(app)
      .post('/api/user/login')
      .send({
        email: user.superClient.email,
        password: user.superClient.password,
      })
      .then((res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Authenticated User Signout', () => {
  it('should signout a logged in user', (done) => {
    chai
      .request(app)
      .post('/api/user/signout')
      .set('Authorization', `Bearer ${correctToken}`)
      .end((err, res) => {
        const {
          status, body
        } = res;
        expect(status).to.equal(200);
        expect(body).to.have.property('message');
        expect(body.message).to.equals('successfully signed out');
        done();
      });
  });

  it('should not signout a user if he/she is already logged out', (done) => {
    chai
      .request(app)
      .post('/api/user/signout')
      .set('Authorization', 'Bearer eyeyeyeyyeyeyeyeyeyeye')
      .end((err, res) => {
        const {
          status, body
        } = res;
        expect(status).to.equal(401);
        expect(body).to.have.property('error');
        expect(body.error).to.equals(
          'unauthorised to use this resource, please signup/login'
        );
        done();
      });
  });
});
