/* eslint-disable no-tabs */
import {
  contactForm
} from '../helpers/mailer/contactForm';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';

/**
 * contact Controller
 */
export default class ContactController {
  /**
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {String} return token response
	 *
	 */
  static async contactWithEmail(req, res) {
    const {
      names, email, subject, message
    } = req.body;
    if (!names) {
      return sendError(res, 'names is required', 400);
    }
    if (!email) {
      return sendError(res, 'email is required', 400);
    }
    if (!subject) {
      return sendError(res, 'subject is required', 400);
    }
    if (!message) {
      return sendError(res, 'message is required', 400);
    }
    try {
      await contactForm(names, email, subject, message);
      return sendSuccess(res, null, 'Thank you for contacting QuincaParadi, we will back to you soon!', 201);
    } catch (error) {
      return sendError(res, 'Failed to contact', 500, error.message);
    }
  }
}
