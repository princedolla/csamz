const carModel = require("../models/carModel");

const getCars = async (req, res, next) => {
  try {
    const data = await carModel.getAllCars();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createCar = async (req, res, next) => {
  try {
    await carModel.createCar(req.body);
    res.status(201).json({ success: true, message: "Car created" });
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const affectedRows = await carModel.updateCar(req.params.id, req.body);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.json({ success: true, message: "Car updated" });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const affectedRows = await carModel.deleteCar(req.params.id);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.json({ success: true, message: "Car deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, createCar, updateCar, deleteCar };
