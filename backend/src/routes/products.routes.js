const express = require('express');

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getProducts);

router.post('/', authMiddleware, upload.single('image'), createProduct);

router.put('/:id', authMiddleware, upload.single('image'), updateProduct);

router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;