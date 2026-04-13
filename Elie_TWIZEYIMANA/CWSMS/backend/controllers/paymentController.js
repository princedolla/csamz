const paymentModel = require("../models/paymentModel");

const getPayments = async (req, res, next) => {
  try {
    const data = await paymentModel.getAllPayments();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const id = await paymentModel.createPayment(req.body);
    res.status(201).json({ success: true, message: "Payment created", id });
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const affectedRows = await paymentModel.updatePayment(req.params.id, req.body);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.json({ success: true, message: "Payment updated" });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const affectedRows = await paymentModel.deletePayment(req.params.id);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.json({ success: true, message: "Payment deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
