import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dontenv from 'dotenv';

dontenv.config();

class Auth {
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static generateToken(id, email, names, userType) {
    const secret = process.env.SECRET || process.env.JWT_SECRET || 'hadiwa_super_secret_jwt_key_2026';
    const token = jwt.sign({
      id,
      email,
      names,
      userType
    },
    secret, {
      expiresIn: '24h'
    });
    return token;
  }

  static decodeToken(token) {
    const secret = process.env.SECRET || process.env.JWT_SECRET || 'hadiwa_super_secret_jwt_key_2026';
    let payload = '';
    jwt.verify(token, secret, (err, decoded) => {
      payload = decoded;
    });
    return payload;
  }
}

export default Auth;
