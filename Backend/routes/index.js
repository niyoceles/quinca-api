import express from 'express';

import users from './userRoutes';
import items from './itemRoutes';
import supplier from './supplierRoutes';
import order from './orderRoutes';
import category from './categoryRoutes';
import proforma from './proformaRoutes';
import search from './search';
import contact from './contactRoutes';
import notifications from './notificationRoutes';
import messages from './messageRoutes';

const router = express.Router();

router.use('/supplier', supplier);
router.use('/user', users);
router.use('/item', items);
router.use('/order', order);
router.use('/category', category);
router.use('/proforma', proforma);
router.use('/search', search);
router.use('/contact', contact);
router.use('/notifications', notifications);
router.use('/messages', messages);

export default router;
