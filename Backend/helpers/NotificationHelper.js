import {
  getIo
} from './socket';
import models from '../models';

const {
  notifications
} = models;

/**
 * Helper to create and emit notifications
 * @param {string} userId - ID of the user to receive the notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message content
 * @param {string} type - Notification type (e.g., 'order')
 */
export const createAndEmitNotification = async (userId, title, message, type) => {
  try {
    // 1. Persist to database
    const notification = await notifications.create({
      userId,
      title,
      message,
      type,
      isRead: false,
    });

    // 2. Emit via socket.io to the user's specific room
    const io = getIo();
    if (io) {
      io.to(userId).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error in createAndEmitNotification:', error);
    return null;
  }
};
