const packageModel = require("../models/packageModel");

const getPackages = async (req, res, next) => {
  try {
    const data = await packageModel.getAllPackages();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createPackage = async (req, res, next) => {
  try {
    const id = await packageModel.createPackage(req.body);
    res.status(201).json({ success: true, message: "Package created", id });
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const affectedRows = await packageModel.updatePackage(req.params.id, req.body);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, message: "Package updated" });
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const affectedRows = await packageModel.deletePackage(req.params.id);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, message: "Package deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPackages, createPackage, updatePackage, deletePackage };
