const db = require("../config/db");

const getAllPayments = async () => {
  const [rows] = await db.query(
    `SELECT py.PaymentNumber, py.RecordNumber, py.AmountPaid, py.PaymentDate,
            sp.PlateNumber, p.PackageName
     FROM Payment py
     JOIN ServicePackage sp ON py.RecordNumber = sp.RecordNumber
     JOIN Package p ON sp.PackageNumber = p.PackageNumber
     ORDER BY py.PaymentNumber DESC`
  );
  return rows;
};

const getPaymentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM Payment WHERE PaymentNumber = ?", [id]);
  return rows[0];
};

const createPayment = async ({ RecordNumber, AmountPaid, PaymentDate }) => {
  const [result] = await db.query(
    "INSERT INTO Payment (RecordNumber, AmountPaid, PaymentDate) VALUES (?, ?, ?)",
    [RecordNumber, AmountPaid, PaymentDate]
  );
  return result.insertId;
};

const updatePayment = async (id, { RecordNumber, AmountPaid, PaymentDate }) => {
  const [result] = await db.query(
    "UPDATE Payment SET RecordNumber = ?, AmountPaid = ?, PaymentDate = ? WHERE PaymentNumber = ?",
    [RecordNumber, AmountPaid, PaymentDate, id]
  );
  return result.affectedRows;
};

const deletePayment = async (id) => {
  const [result] = await db.query("DELETE FROM Payment WHERE PaymentNumber = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
