import express from 'express';
import supplierController from '../controllers/supplierController';
import {
  checkToken
} from '../helpers';

const router = express.Router();
router.get('/myprofile', checkToken, supplierController.myprofile);
router.get('/viewsupplier/:id', supplierController.viewSupplierAccount);
router.get('/all', supplierController.getSuppliers);
router.put('/update/images', checkToken, supplierController.updateProfileImage);

export default router;
