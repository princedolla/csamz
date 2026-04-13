const reportModel = require("../models/reportModel");

const getReport = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const startDate = req.query.startDate || today;
    const endDate = req.query.endDate || today;

    const data = await reportModel.getServiceReport(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReport };
