import models from '../models';
import { sendSuccess, sendError } from '../helpers/responseHelper';

const { messages, users } = models;

const senderAttrs = ['id', 'names', 'email', 'profile', 'organization'];

class MessageController {
  // GET /api/messages/conversations
  // Returns distinct list of people the current user has exchanged messages with
  static async getConversations(req, res) {
    try {
      const myId = req.decoded.id;

      const sent = await messages.findAll({
        where: { senderId: myId },
        include: [{ model: users, as: 'receiver', attributes: senderAttrs }],
        order: [['createdAt', 'DESC']],
      });

      const received = await messages.findAll({
        where: { receiverId: myId },
        include: [{ model: users, as: 'sender', attributes: senderAttrs }],
        order: [['createdAt', 'DESC']],
      });

      // Build a map of unique conversation partners
      const partnerMap = new Map();

      for (const msg of sent) {
        const partner = msg.receiver;
        if (!partnerMap.has(partner.id)) {
          const unread = await messages.count({
            where: { senderId: partner.id, receiverId: myId, isRead: false },
          });
          partnerMap.set(partner.id, {
            partnerId: partner.id,
            name: partner.names,
            email: partner.email,
            organization: partner.organization,
            avatar: partner.profile,
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            unread,
          });
        }
      }

      for (const msg of received) {
        const partner = msg.sender;
        if (!partnerMap.has(partner.id)) {
          const unread = await messages.count({
            where: { senderId: partner.id, receiverId: myId, isRead: false },
          });
          partnerMap.set(partner.id, {
            partnerId: partner.id,
            name: partner.names,
            email: partner.email,
            organization: partner.organization,
            avatar: partner.profile,
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            unread,
          });
        }
      }

      return sendSuccess(res, Array.from(partnerMap.values()), 'Conversations fetched');
    } catch (error) {
      return sendError(res, 'Failed to fetch conversations', 500, error.message);
    }
  }

  // GET /api/messages/:partnerId
  // Returns full thread between current user and a partner
  static async getThread(req, res) {
    try {
      const myId = req.decoded.id;
      const { partnerId } = req.params;
      const { Op } = require('sequelize');

      const thread = await messages.findAll({
        where: {
          [Op.or]: [
            { senderId: myId, receiverId: partnerId },
            { senderId: partnerId, receiverId: myId },
          ],
        },
        include: [
          { model: users, as: 'sender', attributes: senderAttrs },
          { model: users, as: 'receiver', attributes: senderAttrs },
        ],
        order: [['createdAt', 'ASC']],
      });

      // Mark received messages as read
      await messages.update(
        { isRead: true },
        { where: { senderId: partnerId, receiverId: myId, isRead: false } }
      );

      return sendSuccess(res, thread, 'Thread fetched');
    } catch (error) {
      return sendError(res, 'Failed to fetch thread', 500, error.message);
    }
  }

  // POST /api/messages
  // Send a new message
  static async sendMessage(req, res) {
    try {
      const myId = req.decoded.id;
      const { receiverId, text } = req.body;

      if (!receiverId || !text) {
        return sendError(res, 'receiverId and text are required', 400);
      }

      const receiver = await users.findByPk(receiverId);
      if (!receiver) {
        return sendError(res, 'Receiver not found', 404);
      }

      const newMessage = await messages.create({
        senderId: myId,
        receiverId,
        text,
      });

      const full = await messages.findByPk(newMessage.id, {
        include: [
          { model: users, as: 'sender', attributes: senderAttrs },
          { model: users, as: 'receiver', attributes: senderAttrs },
        ],
      });

      return sendSuccess(res, full, 'Message sent', 201);
    } catch (error) {
      return sendError(res, 'Failed to send message', 500, error.message);
    }
  }
}

export default MessageController;
