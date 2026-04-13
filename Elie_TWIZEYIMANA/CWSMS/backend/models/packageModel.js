const db = require("../config/db");

const getAllPackages = async () => {
  const [rows] = await db.query("SELECT * FROM Package ORDER BY PackageNumber DESC");
  return rows;
};

const getPackageById = async (id) => {
  const [rows] = await db.query("SELECT * FROM Package WHERE PackageNumber = ?", [id]);
  return rows[0];
};

const createPackage = async ({ PackageName, PackageDescription, PackagePrice }) => {
  const [result] = await db.query(
    "INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)",
    [PackageName, PackageDescription, PackagePrice]
  );
  return result.insertId;
};

const updatePackage = async (id, { PackageName, PackageDescription, PackagePrice }) => {
  const [result] = await db.query(
    "UPDATE Package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?",
    [PackageName, PackageDescription, PackagePrice, id]
  );
  return result.affectedRows;
};

const deletePackage = async (id) => {
  const [result] = await db.query("DELETE FROM Package WHERE PackageNumber = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
