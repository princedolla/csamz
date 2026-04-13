import { useEffect, useState } from "react";
import { packageAPI } from "../services/api";

const initialForm = {
  PackageNumber: "",
  PackageName: "",
  PackageDescription: "",
  PackagePrice: "",
};

function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPackages = async () => {
    const res = await packageAPI.getAll();
    setPackages(res.data.data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      PackageName: form.PackageName,
      PackageDescription: form.PackageDescription,
      PackagePrice: Number(form.PackagePrice),
    };

    if (isEditing) {
      await packageAPI.update(form.PackageNumber, payload);
    } else {
      await packageAPI.create(payload);
    }

    setForm(initialForm);
    setIsEditing(false);
    fetchPackages();
  };

  const startEdit = (item) => {
    setForm(item);
    setIsEditing(true);
  };

  const removePackage = async (id) => {
    await packageAPI.delete(id);
    fetchPackages();
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-semibold">Package Management</h2>
      <form className="grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
        <input
          className="rounded border p-2"
          placeholder="Package Name"
          value={form.PackageName}
          onChange={(e) => setForm({ ...form, PackageName: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Description"
          value={form.PackageDescription}
          onChange={(e) => setForm({ ...form, PackageDescription: e.target.value })}
          required
        />
        <input
          type="number"
          className="rounded border p-2"
          placeholder="Price"
          value={form.PackagePrice}
          onChange={(e) => setForm({ ...form, PackagePrice: e.target.value })}
          required
        />
        <button className="rounded bg-blue-600 p-2 text-white hover:bg-blue-500" type="submit">
          {isEditing ? "Update Package" : "Add Package"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((item) => (
              <tr key={item.PackageNumber}>
                <td className="border p-2">{item.PackageNumber}</td>
                <td className="border p-2">{item.PackageName}</td>
                <td className="border p-2">{item.PackageDescription}</td>
                <td className="border p-2">{item.PackagePrice}</td>
                <td className="border p-2">
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white"
                    onClick={() => startEdit(item)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removePackage(item.PackageNumber)}
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

export default PackageManagement;
