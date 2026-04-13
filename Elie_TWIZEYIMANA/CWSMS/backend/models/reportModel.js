const db = require("../config/db");

const getServiceReport = async (startDate, endDate) => {
  const [rows] = await db.query(
    `SELECT sp.RecordNumber, sp.ServiceDate, sp.PlateNumber, c.DriverName,
            p.PackageName, p.PackagePrice,
            COALESCE(SUM(py.AmountPaid), 0) AS TotalPaidForService
     FROM ServicePackage sp
     JOIN Car c ON sp.PlateNumber = c.PlateNumber
     JOIN Package p ON sp.PackageNumber = p.PackageNumber
     LEFT JOIN Payment py ON py.RecordNumber = sp.RecordNumber
     WHERE DATE(sp.ServiceDate) BETWEEN ? AND ?
     GROUP BY sp.RecordNumber, sp.ServiceDate, sp.PlateNumber, c.DriverName, p.PackageName, p.PackagePrice
     ORDER BY sp.ServiceDate DESC`,
    [startDate, endDate]
  );

  const [totals] = await db.query(
    `SELECT COALESCE(SUM(AmountPaid), 0) AS TotalPayments
     FROM Payment
     WHERE DATE(PaymentDate) BETWEEN ? AND ?`,
    [startDate, endDate]
  );

  return {
    services: rows,
    totalPayments: totals[0].TotalPayments,
  };
};

module.exports = { getServiceReport };
