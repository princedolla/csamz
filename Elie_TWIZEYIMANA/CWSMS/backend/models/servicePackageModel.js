const db = require("../config/db");

const getAllServicePackages = async () => {
  const [rows] = await db.query(
    `SELECT sp.RecordNumber, sp.PlateNumber, sp.PackageNumber, sp.ServiceDate,
            p.PackageName, p.PackagePrice, c.DriverName
     FROM ServicePackage sp
     JOIN Package p ON sp.PackageNumber = p.PackageNumber
     JOIN Car c ON sp.PlateNumber = c.PlateNumber
     ORDER BY sp.RecordNumber DESC`
  );
  return rows;
};

const getServicePackageById = async (id) => {
  const [rows] = await db.query("SELECT * FROM ServicePackage WHERE RecordNumber = ?", [id]);
  return rows[0];
};

const createServicePackage = async ({ PlateNumber, PackageNumber, ServiceDate }) => {
  const [result] = await db.query(
    "INSERT INTO ServicePackage (PlateNumber, PackageNumber, ServiceDate) VALUES (?, ?, ?)",
    [PlateNumber, PackageNumber, ServiceDate]
  );
  return result.insertId;
};

const updateServicePackage = async (id, { PlateNumber, PackageNumber, ServiceDate }) => {
  const [result] = await db.query(
    "UPDATE ServicePackage SET PlateNumber = ?, PackageNumber = ?, ServiceDate = ? WHERE RecordNumber = ?",
    [PlateNumber, PackageNumber, ServiceDate, id]
  );
  return result.affectedRows;
};

const deleteServicePackage = async (id) => {
  const [result] = await db.query("DELETE FROM ServicePackage WHERE RecordNumber = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllServicePackages,
  getServicePackageById,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
};
