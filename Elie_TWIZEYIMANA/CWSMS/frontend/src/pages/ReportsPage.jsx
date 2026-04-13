import { useEffect, useState } from "react";
import { reportAPI } from "../services/api";

function ReportsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [services, setServices] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchReport = async () => {
    const res = await reportAPI.getByDate(startDate, endDate);
    setServices(res.data.data.services);
    setTotalPayments(res.data.data.totalPayments);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="space-y-4 rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-semibold">Reports</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          type="date"
          className="rounded border p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="rounded border p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="rounded bg-blue-600 p-2 text-white hover:bg-blue-500" onClick={fetchReport} type="button">
          Filter
        </button>
      </div>

      <div className="rounded border border-green-300 bg-green-50 p-4">
        <p className="text-lg font-semibold text-green-700">Total Payments Collected: {Number(totalPayments).toLocaleString()} RWF</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border p-2">Record</th>
              <th className="border p-2">Plate</th>
              <th className="border p-2">Driver</th>
              <th className="border p-2">Package</th>
              <th className="border p-2">Package Price</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Service Date</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.RecordNumber}>
                <td className="border p-2">{service.RecordNumber}</td>
                <td className="border p-2">{service.PlateNumber}</td>
                <td className="border p-2">{service.DriverName}</td>
                <td className="border p-2">{service.PackageName}</td>
                <td className="border p-2">{service.PackagePrice}</td>
                <td className="border p-2">{service.TotalPaidForService}</td>
                <td className="border p-2">{new Date(service.ServiceDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsPage;
