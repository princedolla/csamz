import { useEffect, useState } from "react";
import { carAPI } from "../services/api";

const initialForm = {
  PlateNumber: "",
  CarType: "",
  CarSize: "",
  DriverName: "",
  PhoneNumber: "",
};

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCars = async () => {
    const res = await carAPI.getAll();
    setCars(res.data.data);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await carAPI.update(form.PlateNumber, form);
    } else {
      await carAPI.create(form);
    }

    setForm(initialForm);
    setIsEditing(false);
    fetchCars();
  };

  const startEdit = (car) => {
    setForm(car);
    setIsEditing(true);
  };

  const removeCar = async (plate) => {
    await carAPI.delete(plate);
    fetchCars();
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-semibold">Car Management</h2>
      <form className="grid grid-cols-1 gap-3 md:grid-cols-5" onSubmit={handleSubmit}>
        <input
          className="rounded border p-2"
          placeholder="Plate Number"
          value={form.PlateNumber}
          onChange={(e) => setForm({ ...form, PlateNumber: e.target.value })}
          disabled={isEditing}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Car Type"
          value={form.CarType}
          onChange={(e) => setForm({ ...form, CarType: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Car Size"
          value={form.CarSize}
          onChange={(e) => setForm({ ...form, CarSize: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Driver Name"
          value={form.DriverName}
          onChange={(e) => setForm({ ...form, DriverName: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Phone Number"
          value={form.PhoneNumber}
          onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })}
          required
        />
        <button className="rounded bg-blue-600 p-2 text-white hover:bg-blue-500" type="submit">
          {isEditing ? "Update Car" : "Add Car"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border p-2">Plate</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Driver</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.PlateNumber}>
                <td className="border p-2">{car.PlateNumber}</td>
                <td className="border p-2">{car.CarType}</td>
                <td className="border p-2">{car.CarSize}</td>
                <td className="border p-2">{car.DriverName}</td>
                <td className="border p-2">{car.PhoneNumber}</td>
                <td className="border p-2">
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white"
                    onClick={() => startEdit(car)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removeCar(car.PlateNumber)}
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

export default CarManagement;
