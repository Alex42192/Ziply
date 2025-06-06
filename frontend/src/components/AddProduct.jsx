import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !weight || price === '' || !category) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('weight', weight);
    formData.append('price', parseFloat(price));
    if (discount) formData.append('discount', discount);
    if (deliveryTime) formData.append('deliveryTime', deliveryTime);
    formData.append('category', category);
    formData.append('stock', stock ? parseInt(stock, 10) : 0);
    formData.append('images', imageFile);

    try {
      const response = await fetch('http://localhost:4000/api/v1/product/new', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess('Product added successfully!');
        setName('');
        setWeight('');
        setPrice('');
        setDiscount('');
        setDeliveryTime('');
        setCategory('');
        setStock('');
        setImageFile(null);
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col">
        <div className="mb-5">
          <label htmlFor="name" className="block mb-1 text-gray-600 font-medium">Name *</label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="weight" className="block mb-1 text-gray-600 font-medium">Weight *</label>
          <input
            type="text"
            id="weight"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="price" className="block mb-1 text-gray-600 font-medium">Price *</label>
          <input
            type="number"
            id="price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="discount" className="block mb-1 text-gray-600 font-medium">Discount</label>
          <input
            type="text"
            id="discount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            placeholder="e.g. 10% discount"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="deliveryTime" className="block mb-1 text-gray-600 font-medium">Delivery Time</label>
          <input
            type="text"
            id="deliveryTime"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={deliveryTime}
            onChange={e => setDeliveryTime(e.target.value)}
            placeholder="e.g. 30 min"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="category" className="block mb-1 text-gray-600 font-medium">Category *</label>
          <input
            type="text"
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="stock" className="block mb-1 text-gray-600 font-medium">Stock</label>
          <input
            type="number"
            id="stock"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={stock}
            onChange={e => setStock(e.target.value)}
            min="0"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="images" className="block mb-1 text-gray-600 font-medium">Product Image *</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            className="w-full"
            onChange={handleFileChange}
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white text-lg font-semibold py-3 rounded-md transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
