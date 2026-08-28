const { Payment } = require("../models/paymentmodel");

const createPayment = async (paymentData) => {
  try {
    const payment = await Payment.create(paymentData);
    return payment;
  } catch (error) {
    throw new Error("Error creating payment: " + error.message);
  }
};

const getPaymentsByUserId = async (userId) => {
  try {
    const payments = await Payment.findAll({ where: { user_id: userId } });
    return payments;
  } catch (error) {
    throw new Error("Error fetching payments: " + error.message);
  }
};

const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    return payment;
  } catch (error) {
    throw new Error("Error fetching payment: " + error.message);
  }
};

const deletePaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    await payment.destroy();
    return { message: "Payment deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting payment: " + error.message);
  }
};

module.exports = {
  createPayment,
  getPaymentsByUserId,
  getPaymentById,
  deletePaymentById,
};
