import express from 'express';
import notificationController from '../controllers/notificationController';
import {
  checkToken
} from '../helpers';

const router = express.Router();

router.get('/', checkToken, notificationController.getMyNotifications);
router.patch('/:id/read', checkToken, notificationController.markAsRead);

export default router;
