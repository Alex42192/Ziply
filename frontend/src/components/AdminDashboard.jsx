import React from 'react';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleAddStore = () => {
    navigate('/add-store');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome, Admin</h1>
      <div className="flex justify-center gap-6">
        <button
          className="px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
        <button
          className="px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
          onClick={handleAddStore}
        >
          Add Store
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
