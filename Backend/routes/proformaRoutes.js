import express from 'express';
import proformaController from '../controllers/proformaController';
// import orderValidation from '../validations/orderValidation';
// import itemValidation from '../validations/itemValidation';
import {
  checkToken
} from '../helpers';

const router = express.Router();
// client create an order
router.post(
  '/',
  // '/:itemOwnerId',
  checkToken,
  // itemValidation.validateItemId,
  // orderValidation.validateOrder,
  proformaController.createProforma
);

router.get('/my', checkToken, proformaController.myProforma);
router.get('/', checkToken, proformaController.getProforma);
router.get('/:id', checkToken, proformaController.getSingleProforma);
router.put('/pay', checkToken, proformaController.onlinePayment);
router.delete('/', checkToken, proformaController.cancelOrder);
// owner
router.patch('/', checkToken, proformaController.confirmOrder);
router.get('/supplier', checkToken, proformaController.ourOrders);

export default router;
