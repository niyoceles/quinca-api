import express from 'express';
import categoryController from '../controllers/categoryController';
import {
  checkToken
} from '../helpers';

const router = express.Router();

router.post(
  '/',
  // checkToken,
  categoryController.createCategory
);

router.get('/all', categoryController.allAvailbleCategories);
router.get('/:name', categoryController.getCategory);

router.patch(
  '/suspend/:id',
  checkToken,
  categoryController.suspendCategory
);

router.patch(
  '/activate/:id',
  checkToken,
  categoryController.activateCategory
);
router.delete(
  '/delete/:id',
  checkToken,
  categoryController.deleteCategory
);

export default router;
