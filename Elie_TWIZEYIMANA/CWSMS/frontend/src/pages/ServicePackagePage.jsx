import { useEffect, useState } from "react";
import { carAPI, packageAPI, servicePackageAPI } from "../services/api";

const initialForm = {
  RecordNumber: "",
  PlateNumber: "",
  PackageNumber: "",
  ServiceDate: "",
};

function ServicePackagePage() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    const [recordsRes, carsRes, packagesRes] = await Promise.all([
      servicePackageAPI.getAll(),
      carAPI.getAll(),
      packageAPI.getAll(),
    ]);
    setRecords(recordsRes.data.data);
    setCars(carsRes.data.data);
    setPackages(packagesRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      PlateNumber: form.PlateNumber,
      PackageNumber: Number(form.PackageNumber),
      ServiceDate: form.ServiceDate,
    };

    if (isEditing) {
      await servicePackageAPI.update(form.RecordNumber, payload);
    } else {
      await servicePackageAPI.create(payload);
    }

    setForm(initialForm);
    setIsEditing(false);
    fetchData();
  };

  const startEdit = (record) => {
    setForm({
      ...record,
      ServiceDate: new Date(record.ServiceDate).toISOString().slice(0, 16),
    });
    setIsEditing(true);
  };

  const removeRecord = async (id) => {
    await servicePackageAPI.delete(id);
    fetchData();
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-semibold">Service Package</h2>
      <form className="grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
        <select
          className="rounded border p-2"
          value={form.PlateNumber}
          onChange={(e) => setForm({ ...form, PlateNumber: e.target.value })}
          required
        >
          <option value="">Select Car</option>
          {cars.map((car) => (
            <option key={car.PlateNumber} value={car.PlateNumber}>
              {car.PlateNumber} - {car.DriverName}
            </option>
          ))}
        </select>

        <select
          className="rounded border p-2"
          value={form.PackageNumber}
          onChange={(e) => setForm({ ...form, PackageNumber: e.target.value })}
          required
        >
          <option value="">Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
              {pkg.PackageName}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="rounded border p-2"
          value={form.ServiceDate}
          onChange={(e) => setForm({ ...form, ServiceDate: e.target.value })}
          required
        />

        <button className="rounded bg-blue-600 p-2 text-white hover:bg-blue-500" type="submit">
          {isEditing ? "Update Service" : "Add Service"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border p-2">Record</th>
              <th className="border p-2">Plate</th>
              <th className="border p-2">Driver</th>
              <th className="border p-2">Package</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.RecordNumber}>
                <td className="border p-2">{record.RecordNumber}</td>
                <td className="border p-2">{record.PlateNumber}</td>
                <td className="border p-2">{record.DriverName}</td>
                <td className="border p-2">{record.PackageName}</td>
                <td className="border p-2">{record.PackagePrice}</td>
                <td className="border p-2">{new Date(record.ServiceDate).toLocaleString()}</td>
                <td className="border p-2">
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white"
                    onClick={() => startEdit(record)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removeRecord(record.RecordNumber)}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServicePackagePage;
