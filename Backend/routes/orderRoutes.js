import express from 'express';
import orderController from '../controllers/orderController';
import orderValidation from '../validations/orderValidation';
// import itemValidation from '../validations/itemValidation';
import {
  checkToken
} from '../helpers';

const router = express.Router();
// client create an order
router.post(
  '/',
  // checkToken,
  // itemValidation.validateItemId,
  orderValidation.validateOrder,
  orderController.createOrder
);

router.get('/', checkToken, orderController.getOrders);
router.get('/:id', orderController.getSingleOrder);
router.put('/pay', checkToken, orderController.onlinePayment);
router.delete('/', checkToken, orderController.cancelOrder);
// owner
router.patch('/', checkToken, orderController.confirmOrder);
router.get('/supplier', checkToken, orderController.ourOrders);

export default router;
