import express from 'express';
import itemController from '../controllers/itemController';
import itemValidation from '../validations/itemValidation';
import {
  checkToken
} from '../helpers';

const router = express.Router();

router.post(
  '/',
  checkToken,
  itemValidation.validateItem,
  itemController.createItem
);

router.put(
  '/:id',
  checkToken,
  itemValidation.validateItem,
  itemController.updateItem
);

router.patch(
  '/suspend/:id',
  checkToken,
  itemValidation.validateItemId,
  itemController.suspendItem
);

router.patch(
  '/activate/:id',
  checkToken,
  itemValidation.validateItemId,
  itemController.activateItem
);

router.get('/all', itemController.allAvailbleItems);
router.get('/home', itemController.getHomeItems);
router.get('/related/:category', itemController.relatedItems);
router.get('/:id', itemController.getItem);

router.post('/search', itemController.searchItem);
router.get('/', checkToken, itemController.GetMyItems);

router.delete(
  '/delete/:id',
  checkToken,
  itemValidation.validateItemId,
  itemController.deleteItem
);

export default router;
