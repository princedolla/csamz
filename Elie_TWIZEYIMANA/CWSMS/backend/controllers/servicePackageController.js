const servicePackageModel = require("../models/servicePackageModel");

const getServicePackages = async (req, res, next) => {
  try {
    const data = await servicePackageModel.getAllServicePackages();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createServicePackage = async (req, res, next) => {
  try {
    const id = await servicePackageModel.createServicePackage(req.body);
    res.status(201).json({ success: true, message: "Service record created", id });
  } catch (error) {
    next(error);
  }
};

const updateServicePackage = async (req, res, next) => {
  try {
    const affectedRows = await servicePackageModel.updateServicePackage(req.params.id, req.body);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Service record not found" });
    }
    res.json({ success: true, message: "Service record updated" });
  } catch (error) {
    next(error);
  }
};

const deleteServicePackage = async (req, res, next) => {
  try {
    const affectedRows = await servicePackageModel.deleteServicePackage(req.params.id);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Service record not found" });
    }
    res.json({ success: true, message: "Service record deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicePackages,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
};
