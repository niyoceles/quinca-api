import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import client from './redis';

dotenv.config();
export const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: 'unauthorised to use this resource, please signup/login',
      });
    }

    const token = authHeader.startsWith('Bearer') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    const tokenFound = await client.get(token);

    if (tokenFound === 'Blacklisted') {
      return res.status(401).json({
        error: 'please login/signup to access this resource',
      });
    }

    const secret = process.env.SECRET || process.env.JWT_SECRET || 'hadiwa_super_secret_jwt_key_2026';
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          error: 'unauthorised to use this resource, please signup/login',
        });
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      error: 'unauthorised to use this resource, please signup/login',
    });
  }
};
