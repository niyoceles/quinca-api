import express from 'express';
import ContactController from '../controllers/ContactController';

const router = express.Router();

router.post('/', ContactController.contactWithEmail);

export default router;
