// src/components/CarManagement.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    CarType: '',
    CarSize: '',
    DriverName: '',
    PhoneNumber: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Fetch cars error:', error);
      toast.error('Failed to fetch cars');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axiosInstance.put(`/cars/${formData.PlateNumber}`, formData);
        toast.success('Car updated successfully');
      } else {
        await axiosInstance.post('/cars', formData);
        toast.success('Car added successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCars();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axiosInstance.delete(`/cars/${plateNumber}`);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete car');
      }
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData(car);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: '',
      CarType: '',
      CarSize: '',
      DriverName: '',
      PhoneNumber: ''
    });
    setEditingCar(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Car Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Car
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No cars found. Click "Add New Car" to add one.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.PlateNumber}>
                  <td className="px-6 py-4 whitespace-nowrap">{car.PlateNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.CarType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.CarSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.DriverName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.PhoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.PlateNumber)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Plate Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.PlateNumber}
                  onChange={(e) => setFormData({ ...formData, PlateNumber: e.target.value })}
                  required
                  disabled={editingCar}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Car Type</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.CarType}
                  onChange={(e) => setFormData({ ...formData, CarType: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Car Size</label>
                <select
                  className="input-field"
                  value={formData.CarSize}
                  onChange={(e) => setFormData({ ...formData, CarSize: e.target.value })}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Driver Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.DriverName}
                  onChange={(e) => setFormData({ ...formData, DriverName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.PhoneNumber}
                  onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
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
                  {editingCar ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;