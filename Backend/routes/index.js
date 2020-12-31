import express from 'express';

import users from './userRoutes';
import items from './itemRoutes';
import supplier from './supplierRoutes';
import order from './orderRoutes';
import category from './categoryRoutes';
import proforma from './proformaRoutes';

const router = express.Router();

router.use('/supplier', supplier);
router.use('/user', users);
router.use('/item', items);
router.use('/order', order);
router.use('/category', category);
router.use('/proforma', proforma);


export default router;
