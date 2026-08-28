const PaymentController = require('../controllers/paymentController');
const express = require('express');
const router = express.Router();

router.post('/payments', PaymentController.createPayment);
router.get('/payments/user/:userId', PaymentController.getPaymentsByUserId);
router.get('/payments/:paymentId', PaymentController.getPaymentById);
router.delete('/payments/:paymentId', PaymentController.deletePaymentById);


module.exports = router;

