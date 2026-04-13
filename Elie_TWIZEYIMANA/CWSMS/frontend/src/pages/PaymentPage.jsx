import { useEffect, useState } from "react";
import { paymentAPI, servicePackageAPI } from "../services/api";

const initialForm = {
  PaymentNumber: "",
  RecordNumber: "",
  AmountPaid: "",
  PaymentDate: "",
};

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    const [paymentsRes, recordsRes] = await Promise.all([paymentAPI.getAll(), servicePackageAPI.getAll()]);
    setPayments(paymentsRes.data.data);
    setRecords(recordsRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      RecordNumber: Number(form.RecordNumber),
      AmountPaid: Number(form.AmountPaid),
      PaymentDate: form.PaymentDate,
    };

    if (isEditing) {
      await paymentAPI.update(form.PaymentNumber, payload);
    } else {
      await paymentAPI.create(payload);
    }

    setForm(initialForm);
    setIsEditing(false);
    fetchData();
  };

  const startEdit = (payment) => {
    setForm({
      ...payment,
      PaymentDate: new Date(payment.PaymentDate).toISOString().slice(0, 16),
    });
    setIsEditing(true);
  };

  const removePayment = async (id) => {
    await paymentAPI.delete(id);
    fetchData();
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-semibold">Payment</h2>
      <form className="grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
        <select
          className="rounded border p-2"
          value={form.RecordNumber}
          onChange={(e) => setForm({ ...form, RecordNumber: e.target.value })}
          required
        >
          <option value="">Select Service Record</option>
          {records.map((record) => (
            <option key={record.RecordNumber} value={record.RecordNumber}>
              #{record.RecordNumber} - {record.PlateNumber} ({record.PackageName})
            </option>
          ))}
        </select>

        <input
          type="number"
          className="rounded border p-2"
          placeholder="Amount Paid"
          value={form.AmountPaid}
          onChange={(e) => setForm({ ...form, AmountPaid: e.target.value })}
          required
        />

        <input
          type="datetime-local"
          className="rounded border p-2"
          value={form.PaymentDate}
          onChange={(e) => setForm({ ...form, PaymentDate: e.target.value })}
          required
        />

        <button className="rounded bg-blue-600 p-2 text-white hover:bg-blue-500" type="submit">
          {isEditing ? "Update Payment" : "Add Payment"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="border p-2">Payment #</th>
              <th className="border p-2">Record #</th>
              <th className="border p-2">Plate</th>
              <th className="border p-2">Package</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.PaymentNumber}>
                <td className="border p-2">{payment.PaymentNumber}</td>
                <td className="border p-2">{payment.RecordNumber}</td>
                <td className="border p-2">{payment.PlateNumber}</td>
                <td className="border p-2">{payment.PackageName}</td>
                <td className="border p-2">{payment.AmountPaid}</td>
                <td className="border p-2">{new Date(payment.PaymentDate).toLocaleString()}</td>
                <td className="border p-2">
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white"
                    onClick={() => startEdit(payment)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removePayment(payment.PaymentNumber)}
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

export default PaymentPage;
