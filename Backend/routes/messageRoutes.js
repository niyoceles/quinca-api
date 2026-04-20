import express from 'express';
import MessageController from '../controllers/messageController';
import { checkToken } from '../helpers';

const router = express.Router();

router.get('/conversations', checkToken, MessageController.getConversations);
router.get('/:partnerId', checkToken, MessageController.getThread);
router.post('/', checkToken, MessageController.sendMessage);

export default router;
