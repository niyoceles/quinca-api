/* eslint-disable no-tabs */
import {
  contactForm
} from '../helpers/mailer/contactForm';

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
      return res.status(400).json({
        error: 'names is required',
      });
    }
    if (!email) {
      return res.status(400).json({
        error: 'email is required',
      });
    }
    if (!subject) {
      return res.status(400).json({
        error: 'subject is required',
      });
    }
    if (!message) {
      return res.status(400).json({
        error: 'message is required',
      });
    }
    try {
      await contactForm(names, email, subject, message);
      return res.status(201).json({
        message: 'Thank you for contacting QuincaParadi, we will back to you soon!',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to contact',
      });
    }
  }
}
