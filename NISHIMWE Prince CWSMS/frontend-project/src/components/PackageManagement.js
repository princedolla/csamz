// src/components/PackageManagement.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    PackageName: '',
    PackageDescription: '',
    PackagePrice: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axiosInstance.get('/packages');
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await axiosInstance.put(`/packages/${editingPackage.PackageNumber}`, formData);
        toast.success('Package updated successfully');
      } else {
        await axiosInstance.post('/packages', formData);
        toast.success('Package added successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axiosInstance.delete(`/packages/${id}`);
        toast.success('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      PackageName: pkg.PackageName,
      PackageDescription: pkg.PackageDescription,
      PackagePrice: pkg.PackagePrice
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      PackageName: '',
      PackageDescription: '',
      PackagePrice: ''
    });
    setEditingPackage(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Package Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.PackageNumber} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.PackageName}</h3>
              <p className="text-gray-600 mb-4">{pkg.PackageDescription}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(pkg.PackagePrice)}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.PackageNumber)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Package Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.PackageName}
                  onChange={(e) => setFormData({ ...formData, PackageName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={formData.PackageDescription}
                  onChange={(e) => setFormData({ ...formData, PackageDescription: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price (RWF)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.PackagePrice}
                  onChange={(e) => setFormData({ ...formData, PackagePrice: e.target.value })}
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
                  {editingPackage ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;