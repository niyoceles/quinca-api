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
  // checkToken,
  // itemValidation.validateItemId,
  // orderValidation.validateOrder,
  proformaController.createProforma
);

router.get('/', checkToken, proformaController.getProforma);
router.get('/:id', proformaController.getSingleProforma);
router.delete('/', proformaController.cancelOrder);
// owner
router.patch('/', checkToken, proformaController.confirmOrder);
export default router;
