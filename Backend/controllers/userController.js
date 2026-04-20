import sendEmail from '../helpers/mailHelper';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import Auth from '../helpers/Auth';
import client from '../helpers/redis';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';
import { clearItemCache } from '../helpers/cacheHelper';

dotenv.config();

const { SENDER_EMAIL, BACKEND_URL, SECRET, FRONT_END_URL } = process.env;
const { users } = models;

class userController {
  static async signupClient(req, res) {
    const { names, email, phoneNumber, password } = req.body;

    const hashedPassword = Auth.hashPassword(password);

    const checkUserEmail = await users.findOne({
      where: { email },
    });

    const checkUserPhone = await users.findOne({
      where: { phoneNumber },
    });

    if (checkUserEmail) {
      return sendError(res, 'this email already Exist', 403);
    }

    if (checkUserPhone) {
      return sendError(res, 'this phone number already Exist', 403);
    }

    try {
      const newUser = await users.create({
        names,
        email,
        password: hashedPassword,
        userType: 'client',
        phoneNumber,
        status: true,
        isVerified: true, // No need to verify for clients
      });
      console.log('CLIENT_SIGNUP_SUCCESS:', email, 'isVerified:', newUser.isVerified);
      if (newUser) {
        const token = Auth.generateToken(
          newUser.id,
          email,
          names,
          newUser.userType
        );
        const html = `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
                      <h1 style="color: #444;">Welcome to Hadiwa!</h1>
                      <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${names},<br> Your account has been created successfully. You can now start browsing construction materials and requesting proformas.</p>
                      <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${FRONT_END_URL}/login">Login to your account</a>
                      </a></p>
                      <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for using our application!</p>
                      <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,<br>Hadiwa Team</p>
                      </div>`;
        
        await sendEmail({
          to: email,
          subject: 'Welcome to Hadiwa',
          html,
        });
        return sendSuccess(res, {
          token,
        }, 'Your account successful created', 201, null, {
          token,
        });
      }
    } catch (error) {
      return sendError(res, 'Failed to create user account', 500, error.message);
    }
  }

  static async signupSupplier(req, res) {
    const {
      names,
      profile,
      email,
      phoneNumber,
      password,
      nationalId,
      organization,
      description,
      birthDate,
      country,
      state,
      city,
      address,
      location,
    } = req.body;

    const hashedPassword = Auth.hashPassword(password);

    const checkUserEmail = await users.findOne({
      where: { email },
    });

    const checkUserPhone = await users.findOne({
      where: { phoneNumber },
    });

    if (checkUserEmail) {
      return res.status(403).json({
        error: 'this email already Exist',
      });
    }

    if (checkUserPhone) {
      return res.status(403).json({
        error: 'this phone number already Exist',
      });
    }

    try {
      const newUser = await users.create({
        names,
        profile,
        email,
        password: hashedPassword,
        userType: 'supplier',
        phoneNumber,
        nationalId,
        birthDate,
        organization,
        description,
        country,
        state,
        city,
        address,
        location,
        status: false,
      });
      console.log('SUPPLIER_SIGNUP_SUCCESS:', email, 'isVerified:', newUser.isVerified);
      if (newUser) {
        const token = Auth.generateToken(
          newUser.id,
          email,
          names,
          newUser.userType
        );
        const html = `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
                <h1 style="color: #444;">Hadiwa Web App</h1>
                <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${names},<br> Please verify your mail to enjoy premium access.<br> Click the blue button below to verify your account.</p>
                <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/api/user/verify/${token}">Verify account</a>
                  </a></p>
                <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for using our application!</p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,<br>Hadiwa Team</p>
          </div>`;
        
        await sendEmail({
          to: email,
          subject: 'Hadiwa Supplier Account Verification',
          html,
        });

        return sendSuccess(res, null, 'Your account successful created', 201);
      }
    } catch (error) {
      return sendError(res, 'Failed to create user account', 500, error.message);
    }
  }

  static async verifyUser(req, res) {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    try {
      const verified = await users.update(
        { isVerified: true },
        { where: { id: decodedToken.id } }
      );
      if (verified) {
        return res.redirect(`${FRONT_END_URL}/login`);
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to verify your account' });
    }
  }

  static generateToken(req, res) {
    return res.status(200).json({ token: req.params.token });
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return sendError(res, 'email is required', 400);
    }
    if (!password) {
      return sendError(res, 'password is required', 400);
    }
    try {
      const checkUser = await users.findOne({
        where: { email },
      });

      if (!checkUser) {
        console.log('LOGIN_FAILED: USER_NOT_FOUND', email);
        return sendError(res, 'user not found', 404);
      }

      const compared = Auth.comparePassword(password, checkUser.password);
      console.log('LOGIN_ATTEMPT:', email, 'PASSWORD_MATCH:', compared, 'isVerified:', checkUser.isVerified);

      if (!compared) {
        return sendError(res, 'Email and Password are not match', 401);
      }

      if (checkUser.isVerified === false && checkUser.userType !== 'client') {
        return sendError(res, 'your account is not verified, Please verify your account', 401);
      }

      const user = {
        email,
        names: checkUser.names,
        token: Auth.generateToken(
          checkUser.id,
          email,
          checkUser.names,
          checkUser.userType
        ),
      };
      return sendSuccess(res, user, 'User logged successful', 200, null, {
        User: user,
        token: user.token,
      });
    } catch (error) {
      return sendError(res, 'Failed to login', 500, error.message);
    }
  }

  static async sendLinkResetPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'email is required', 400);
    }
    try {
      const checkUser = await users.findOne({
        where: {
          email,
        },
      });
      if (checkUser) {
        const payload = {
          email: checkUser.email,
        };
        const expirationTime = { expiresIn: '1h' };
        const token = jwt.sign(payload, SECRET, expirationTime);
        const html = `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
            <h1 style="color: #444;">${checkUser.names} Please reset your password</h1>
            <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left"><br> Click the button below to reset your password. This link will expire in 1 hour.</p>
            <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 12px 24px; color: #fff; font-size: 16px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;" href="${FRONT_END_URL}/reset-password/${token}">Reset Password</a></p>
            <p style="color:#74787e;font-size:14px;line-height:1.5em;margin-top:20px;">If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="color:#3097d1;font-size:12px;">${FRONT_END_URL}/reset-password/${token}</p>
            </div>`;
        
        await sendEmail({
          to: email,
          subject: 'Hadiwa Password Reset',
          html,
        });
        return sendSuccess(res, null, 'We have sent a password reset link to your email, Please check your email');
      }
      return sendError(res, 'The email provided does not exist', 404);
    } catch (error) {
      return sendError(res, 'Failed to reset password', 500, error.message);
    }
  }

  static async resetPassword(req, res) {
    const { password } = req.body;
    if (!password) {
      return sendError(res, 'new password is required', 400);
    }
    const hashedPassword = Auth.hashPassword(password);
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, SECRET);
      if (decoded) {
        const checkUpdate = await users.update(
          {
            password: hashedPassword,
          },
          {
            where: {
              email: decoded.email,
            },
          }
        );
        if (checkUpdate.length >= 1) {
          return sendSuccess(res, null, 'You have successfully reset your password');
        }
      }
      return sendError(res, 'Permission to access this resource has been denied', 403);
    } catch (error) {
      return sendError(res, 'Failed to reset password', 500, error.message);
    }
  }

  static async signout(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      await client.set(token, 'Blacklisted'); // Blacklist the token and store it in redis
      return res.status(200).json({
        message: 'successfully signed out',
      });
    } catch (error) {
      res.status(500).json({
        error: 'failed to signout',
      });
    }
  }

  // Update user
  static async updateUserAccount(req, res) {
    const {
      names,
      profile,
      email,
      phoneNumber,
      nationalId,
      organization,
      description,
      birthDate,
      country,
      state,
      city,
      address,
      location,
    } = req.body;

    const checkUserEmail = await users.findOne({
      where: { email },
    });

    const checkUserPhone = await users.findOne({
      where: { phoneNumber },
    });

    if (checkUserEmail) {
      if (checkUserEmail.id !== req.decoded.id) {
        return res.status(403).json({
          error: 'this email already Exist',
        });
      }
    }
    if (checkUserPhone) {
      if (checkUserPhone.id !== req.decoded.id) {
        return res.status(403).json({
          error: 'this phone number already Exist',
        });
      }
    }
    try {
      const updatedUser = await users.update(
        {
          names,
          profile,
          email,
          phoneNumber,
          nationalId,
          birthDate,
          organization,
          description,
          country,
          state,
          city,
          address,
          location,
        },
        {
          where: {
            id: req.decoded.id,
          },
        }
      );
      if (updatedUser.length < 1) {
        return sendError(res, 'No updated user', 404);
      }
      return sendSuccess(res, null, 'User updated successful');
    } catch (error) {
      return sendError(res, 'Failed to update user', 500, error.message);
    }
  }

  // Toggle user status (Admin)
  static async toggleUserStatus(req, res) {
    if (req.decoded.userType !== 'admin') {
      return sendError(res, 'Only administrators can perform this action', 403);
    }
    const { id } = req.params;
    try {
      const user = await users.findOne({ where: { id } });
      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      const newStatus = !user.status;
      await users.update(
        { status: newStatus },
        { where: { id } }
      );

      // If it's a supplier, we must clear the item cache because status change 
      // affects visibility of all their items
      if (user.userType === 'supplier') {
        await clearItemCache();
      }

      return sendSuccess(res, { status: newStatus }, `User account ${newStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      return sendError(res, 'Failed to update user status', 500, error.message);
    }
  }
}

export default userController;
