const express = require('express');
const {
  getOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// El cliente puede crear pedidos; solo el admin puede consultarlos o modificar su estado.
router.get('/', authMiddleware, getOrders);
router.post('/', createOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
