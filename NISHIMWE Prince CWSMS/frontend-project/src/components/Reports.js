// src/components/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Reports = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    dailyRevenue: [],
    packageStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/reports/summary`);
      setSummary(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch report data');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      {/* Total Revenue Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm uppercase tracking-wide">Total Revenue</div>
          <div className="text-3xl font-bold mt-2">{formatPrice(summary.totalRevenue)}</div>
          <div className="text-sm mt-2">All time sales</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm uppercase tracking-wide">Total Transactions</div>
          <div className="text-3xl font-bold mt-2">
            {summary.dailyRevenue.reduce((sum, day) => sum + day.DailyRevenue, 0).toLocaleString()} RWF
          </div>
          <div className="text-sm mt-2">Last 7 days</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm uppercase tracking-wide">Package Types</div>
          <div className="text-3xl font-bold mt-2">{summary.packageStats.length}</div>
          <div className="text-sm mt-2">Available services</div>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Revenue (Last 7 Days)</h2>
        <div className="space-y-3">
          {summary.dailyRevenue.map((day, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{new Date(day.Date).toLocaleDateString()}</span>
                <span>{formatPrice(day.DailyRevenue)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(day.DailyRevenue / Math.max(...summary.dailyRevenue.map(d => d.DailyRevenue), 1)) * 100}% 
                  `}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Package Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summary.packageStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stat.PackageName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{stat.ServiceCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">{formatPrice(stat.Revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatPrice(stat.Revenue / stat.ServiceCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            const dataStr = JSON.stringify(summary, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `cwsms_report_${new Date().toISOString().split('T')[0]}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          📥 Export Report (JSON)
        </button>
      </div>
    </div>
  );
};

export default Reports;