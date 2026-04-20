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

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
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
