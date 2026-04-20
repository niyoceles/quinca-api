import express from 'express';
import ContactController from '../controllers/ContactController';
import {
  checkToken
} from '../helpers';

const router = express.Router();

router.post('/', ContactController.contactWithEmail);
router.get('/', checkToken, ContactController.getContactMessages);
router.patch('/:id/read', checkToken, ContactController.markAsRead);

export default router;
