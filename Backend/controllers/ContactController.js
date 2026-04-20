import models from '../models';
import {
  contactForm
} from '../helpers/mailer/contactForm';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';

const { contactMessages } = models;

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
      await contactMessages.create({
        names, email, subject, message
      });
      
      try {
        await contactForm(names, email, subject, message);
      } catch (mailError) {
        console.error('CRITICAL: Email delivery failed for contact form!');
        console.error('Error Message:', mailError.message);
        if (mailError.response) console.error('SendGrid Error:', mailError.response.body);
        // We still return success because the message is saved in our database
      }
      
      return sendSuccess(res, null, 'Thank you for contacting Hadiwa, we will back to you soon!', 201);
    } catch (error) {
      console.error('SYSTEM ERROR in contactWithEmail:', error);
      return sendError(res, 'Failed to contact', 500, error.message);
    }
  }

  static async getContactMessages(req, res) {
    try {
      const allMessages = await contactMessages.findAll({
        order: [['createdAt', 'DESC']]
      });
      return sendSuccess(res, allMessages, 'Contact messages fetched');
    } catch (error) {
      return sendError(res, 'Failed to fetch messages', 500, error.message);
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      await contactMessages.update({ isRead: true }, { where: { id } });
      return sendSuccess(res, null, 'Message marked as read');
    } catch (error) {
      return sendError(res, 'Failed to update message', 500, error.message);
    }
  }
}
