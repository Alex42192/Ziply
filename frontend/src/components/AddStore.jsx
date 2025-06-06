import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStore() {
  const [storeId, setStoreId] = useState('');
  const [address, setAddress] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!storeId || !address || !operatorId) {
      setError('Please fill in all fields.');
      return;
    }

    const body = {
      store_id: parseInt(storeId, 10),
      address,
      operatorId
    };

    try {
      const response = await fetch('http://localhost:4000/api/v1/store/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Store added successfully!');
        setStoreId('');
        setAddress('');
        setOperatorId('');
      } else {
        setError(data.message || 'Failed to add store.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Store</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-6">
          <label htmlFor="storeId" className="block mb-2 text-gray-700 font-semibold">Store ID *</label>
          <input
            type="number"
            id="storeId"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={storeId}
            onChange={e => setStoreId(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-gray-700 font-semibold">Store Address *</label>
          <input
            type="text"
            id="address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="operatorId" className="block mb-2 text-gray-700 font-semibold">Operator ID *</label>
          <input
            type="text"
            id="operatorId"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={operatorId}
            onChange={e => setOperatorId(e.target.value)}
            required
          />
        </div>

        {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}
        {success && <p className="mb-4 text-green-600 font-medium">{success}</p>}

        <button
          type="submit"
          className="px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
        >
          Add Store
        </button>
      </form>
    </div>
  );
}

export default AddStore;
