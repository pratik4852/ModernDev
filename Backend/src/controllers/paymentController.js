const paymentService = require('../services/paymentService');

const createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const payment = await paymentService.createPayment(paymentData);
    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
        message: error.message,
    });
  }
};

const getPaymentsByUserId = async (req, res) => {
    try{
        const { userId } = req.params;
        const payments = await paymentService.getPaymentsByUserId(userId);
        res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await paymentService.getPaymentById(paymentId);
        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deletePaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const result = await paymentService.deletePaymentById(paymentId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPayment,
    getPaymentsByUserId,
    getPaymentById,
    deletePaymentById,
};