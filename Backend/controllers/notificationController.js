import models from '../models';
import {
  sendSuccess,
  sendError
} from '../helpers/responseHelper';

const {
  notifications
} = models;

class notificationController {
  static async getMyNotifications(req, res) {
    try {
      const myNotifications = await notifications.findAll({
        where: {
          userId: req.decoded.id
        },
        order: [
          ['createdAt', 'DESC']
        ]
      });
      return sendSuccess(res, myNotifications, 'Notifications retrieved successfully');
    } catch (error) {
      return sendError(res, 'Failed to retrieve notifications', 500, error.message);
    }
  }

  static async markAsRead(req, res) {
    const {
      id
    } = req.params;
    try {
      const notification = await notifications.findOne({
        where: {
          id,
          userId: req.decoded.id
        }
      });

      if (!notification) {
        return sendError(res, 'Notification not found', 404);
      }

      await notification.update({
        isRead: true
      });
      return sendSuccess(res, notification, 'Notification marked as read');
    } catch (error) {
      return sendError(res, 'Failed to update notification', 500, error.message);
    }
  }
}

export default notificationController;
