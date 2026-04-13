// src/components/PaymentManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    AmountPaid: '',
    RecordNumber: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchServiceRecords();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    }
  };

  const fetchServiceRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-packages`);
      setServiceRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch service records');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await axios.put(`${API_URL}/payments/${editingPayment.PaymentNumber}`, formData);
        toast.success('Payment updated successfully');
      } else {
        await axios.post(`${API_URL}/payments`, formData);
        toast.success('Payment recorded successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await axios.delete(`${API_URL}/payments/${id}`);
        toast.success('Payment deleted successfully');
        fetchPayments();
      } catch (error) {
        toast.error('Failed to delete payment');
      }
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      AmountPaid: payment.AmountPaid,
      RecordNumber: payment.RecordNumber
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      AmountPaid: '',
      RecordNumber: ''
    });
    setEditingPayment(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Record Payment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.PaymentNumber}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.PaymentNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.PaymentDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.ServiceDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.PlateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.DriverName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.PackageName}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">{formatPrice(payment.AmountPaid)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(payment.PaymentNumber)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingPayment ? 'Edit Payment' : 'Record Payment'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Record</label>
                <select
                  className="input-field"
                  value={formData.RecordNumber}
                  onChange={(e) => {
                    const selectedRecord = serviceRecords.find(r => r.RecordNumber === parseInt(e.target.value));
                    setFormData({ 
                      ...formData, 
                      RecordNumber: e.target.value,
                      AmountPaid: selectedRecord ? selectedRecord.PackagePrice : ''
                    });
                  }}
                  required
                >
                  <option value="">Select Service Record</option>
                  {serviceRecords.map((record) => (
                    <option key={record.RecordNumber} value={record.RecordNumber}>
                      #{record.RecordNumber} - {record.PlateNumber} - {record.PackageName} ({formatPrice(record.PackagePrice)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount Paid (RWF)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.AmountPaid}
                  onChange={(e) => setFormData({ ...formData, AmountPaid: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPayment ? 'Update' : 'Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;