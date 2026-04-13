const db = require("../config/db");

const getAllCars = async () => {
  const [rows] = await db.query("SELECT * FROM Car ORDER BY PlateNumber ASC");
  return rows;
};

const getCarByPlate = async (plateNumber) => {
  const [rows] = await db.query("SELECT * FROM Car WHERE PlateNumber = ?", [plateNumber]);
  return rows[0];
};

const createCar = async ({ PlateNumber, CarType, CarSize, DriverName, PhoneNumber }) => {
  const [result] = await db.query(
    "INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)",
    [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
  );
  return result.affectedRows;
};

const updateCar = async (plateNumber, { CarType, CarSize, DriverName, PhoneNumber }) => {
  const [result] = await db.query(
    "UPDATE Car SET CarType = ?, CarSize = ?, DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?",
    [CarType, CarSize, DriverName, PhoneNumber, plateNumber]
  );
  return result.affectedRows;
};

const deleteCar = async (plateNumber) => {
  const [result] = await db.query("DELETE FROM Car WHERE PlateNumber = ?", [plateNumber]);
  return result.affectedRows;
};

module.exports = {
  getAllCars,
  getCarByPlate,
  createCar,
  updateCar,
  deleteCar,
};
