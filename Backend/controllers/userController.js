/* eslint-disable object-curly-newline */
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import Auth from '../helpers/Auth';
import client from '../helpers/redis';

const { users } = models;

const expirationTime = {
	expiresIn: '1day',
};

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { SENDER_EMAIL, BACKEND_URL, SECRET, FRONT_END_URL } = process.env;

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
				email,
				password: hashedPassword,
				userType: 'client',
				phoneNumber,
				status: true,
			});
			if (newUser) {
				const token = Auth.generateToken(
					newUser.id,
					email,
					names,
					newUser.userType
				);
				const msg = {
					to: email,
					from: `${SENDER_EMAIL}`,
					subject: 'store-backend Account Verification',
					html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
                      <h1 style="color: #444;">store-backend Web app</h1>
                      <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${names},<br> Please verify your mail to enjoy premium access.<br> Click the blue button below to verify your account.</p>
                      <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/api/user/verify/${token}">Verify an account</a>
                      </a></p>
                      <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for using our application!</p>
                      <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,<br>store-backend</p>
                      </div>`,
				};
				sgMail.send(msg);
				return res.status(201).json({
					token,
					message: 'Your account successful created',
				});
			}
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to create user account',
			});
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
			if (newUser) {
				const token = Auth.generateToken(
					newUser.id,
					email,
					names,
					newUser.userType
				);
				const msg = {
					to: email,
					from: `${SENDER_EMAIL}`,
					subject: 'Store platform Account Verification',
					html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
                <h1 style="color: #444;">store-backend Web app</h1>
                <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Welcome ${names},<br> Please verify your mail to enjoy premium access.<br> Click the blue button below to verify your account.</p>
                <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/api/user/verify/${token}">Verify an account</a>
                  </a></p>
                <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Thank you for using our application!</p>
            <p style="color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;">Regards,<br>store-backend</p>
          </div>`,
				};
				sgMail.send(msg);

				return res.status(201).json({
					message: 'Your account successful created',
				});
			}
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to create user account',
			});
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
			return res.status(400).json({
				error: 'email is required',
			});
		}
		if (!password) {
			return res.status(400).json({
				error: 'password is required',
			});
		}
		try {
			const checkUser = await users.findOne({
				where: {
					email,
				},
			});

			const checkUserVerified = await users.findOne({
				where: {
					email,
					isVerified: false,
				},
			});

			if (!checkUser) {
				return res.status(404).json({ error: 'user not found' });
			}

			const compared = Auth.comparePassword(password, checkUser.password);
			if (!compared) {
				return res.status(401).json({
					error: 'Email and Password are not match',
				});
			}
			if (checkUserVerified) {
				return res.status(401).json({
					error: 'your account is not verified, Please verify your account',
				});
			}

			return res.status(200).json({
				User: {
					email,
					names: checkUser.names,
					token: Auth.generateToken(
						checkUser.id,
						email,
						checkUser.names,
						checkUser.userType
					),
					type: checkUser.userType,
				},
				message: 'successful sign in',
			});
		} catch (error) {
			return res.status(500).json({ error: 'Failed to sign in' });
		}
	}

	static async sendLinkResetPassword(req, res) {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({
				error: 'email is required',
			});
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
				const token = jwt.sign(payload, SECRET, expirationTime);
				const msg = {
					to: email,
					from: `${SENDER_EMAIL}`,
					subject: 'Reset your password',
					html: `<div style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:35px;">
            <h1 style="color: #444;">${checkUser.names} Please reset your password</h1>
            <p style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#74787e;font-size:16px;line-height:1.5em;margin-top:0;text-align:left"><br> Click the link button below to reset your password.</p>
            <p><a style="background-color: #3097d1; border: 2px solid #3097d1; padding: 8px; color: #fff; font-size: 16px; text-decoration: none;cursor: pointer;" href="${BACKEND_URL}/api/user/get/${token}">Reset password Link </a>
            </a></p>
            </div>`,
				};
				sgMail.send(msg);
				return res.status(200).send({
					message:
						'We have sent a password reset link to your email, Please check your email',
				});
			}
			return res
				.status(404)
				.json({ error: 'The email provided does not exist' });
		} catch (error) {
			return res.status(500).json({ error: 'Failed to reset password' });
		}
	}

	static async resetPassword(req, res) {
		const { password } = req.body;
		if (!password) {
			return res.status(400).json({ error: 'new password is required' });
		}
		const hashedPassword = Auth.hashPassword(password);
		const { token } = req.params;
		try {
			const decoded = await jwt.decode(token, SECRET);
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
					return res
						.status(200)
						.json({ message: 'You have successfully reset your password' });
				}
			}
			return res
				.status(403)
				.json({ error: 'Permission to access this resource has been denied' });
		} catch (error) {
			return res.status(500).send({ error: 'Failed to reset password' });
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
				return res.status(404).json({
					error: 'No updated user',
				});
			}
			return res.status(200).json({
				message: 'User updated successful',
			});
		} catch (error) {
			return res.status(500).json({
				error: 'Failed to update user',
			});
		}
	}
}

export default userController;
