// src/components/ServicePackageManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const ServicePackageManagement = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    ServiceDate: new Date().toISOString().split('T')[0],
    PlateNumber: '',
    PackageNumber: ''
  });

  useEffect(() => {
    fetchServiceRecords();
    fetchCars();
    fetchPackages();
  }, []);

  const fetchServiceRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-packages`);
      setServiceRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch service records');
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API_URL}/cars`);
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_URL}/packages`);
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await axios.put(`${API_URL}/service-packages/${editingRecord.RecordNumber}`, formData);
        toast.success('Service record updated successfully');
      } else {
        await axios.post(`${API_URL}/service-packages`, formData);
        toast.success('Service record created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchServiceRecords();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await axios.delete(`${API_URL}/service-packages/${id}`);
        toast.success('Service record deleted successfully');
        fetchServiceRecords();
      } catch (error) {
        toast.error('Failed to delete service record');
      }
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      ServiceDate: record.ServiceDate.split('T')[0],
      PlateNumber: record.PlateNumber,
      PackageNumber: record.PackageNumber
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ServiceDate: new Date().toISOString().split('T')[0],
      PlateNumber: '',
      PackageNumber: ''
    });
    setEditingRecord(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Service Records Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Service Record
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {serviceRecords.map((record) => (
              <tr key={record.RecordNumber}>
                <td className="px-6 py-4 whitespace-nowrap">{record.RecordNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(record.ServiceDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.PlateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.DriverName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.PackageName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrice(record.PackagePrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.RecordNumber)}
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
              {editingRecord ? 'Edit Service Record' : 'Create Service Record'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.ServiceDate}
                  onChange={(e) => setFormData({ ...formData, ServiceDate: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Car</label>
                <select
                  className="input-field"
                  value={formData.PlateNumber}
                  onChange={(e) => setFormData({ ...formData, PlateNumber: e.target.value })}
                  required
                >
                  <option value="">Select Car</option>
                  {cars.map((car) => (
                    <option key={car.PlateNumber} value={car.PlateNumber}>
                      {car.PlateNumber} - {car.DriverName} ({car.CarType})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Package</label>
                <select
                  className="input-field"
                  value={formData.PackageNumber}
                  onChange={(e) => setFormData({ ...formData, PackageNumber: e.target.value })}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                      {pkg.PackageName} - {formatPrice(pkg.PackagePrice)}
                    </option>
                  ))}
                </select>
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
                  {editingRecord ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackageManagement;