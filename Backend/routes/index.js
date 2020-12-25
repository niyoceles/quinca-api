import express from 'express';

import users from './userRoutes';
import items from './itemRoutes';
import supplier from './supplierRoutes';
import order from './orderRoutes';

const router = express.Router();

router.use('/supplier', supplier);
router.use('/user', users);
router.use('/item', items);
router.use('/order', order);

export default router;
