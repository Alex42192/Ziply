import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('680f1513998428e03e17dd00');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phoneNo: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = angle => angle * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert('Your cart is empty!');
    const { address, city, state, country, pincode, phoneNo } = shippingInfo;
    if (!address || !city || !state || !country || !pincode || !phoneNo) {
      return alert('Please fill all shipping details.');
    }

    const orderItems = cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.imageUrl,
      product: item._id
    }));

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const orderData = {
      shippingInfo,
      orderItems,
      user: userId,
      totalPrice
    };

    try {
      const response = await axios.post('http://localhost:4000/api/v1/order/create', orderData);
      const newOrder = response.data.order;
      const { latitude, longitude } = newOrder.shippingInfo;

      const storeRes = await axios.get('http://localhost:4000/api/v1/store/get-allstores');
      const stores = storeRes.data.stores;

      let minDistance = Infinity;
      let nearestStore = null;

      stores.forEach(store => {
        const dist = haversineDistance(latitude, longitude, store.lat, store.lon);
        if (dist < minDistance) {
          minDistance = dist;
          nearestStore = store;
        }
      });

      if (!nearestStore) return alert('No nearby store found.');

      await axios.post('http://localhost:4000/api/v1/store/add-order', {
        store_id: nearestStore.store_id,
        orderId: newOrder._id
      });

      alert(`Order placed successfully and assigned to store ${nearestStore.store_id}!`);
      localStorage.removeItem('cartItems');
      setCartItems([]);
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 h-full mt-10 font-sans">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty!</p>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center border border-gray-300 rounded-xl p-4">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-36 h-36 object-cover mr-5 rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">Quantity:</span>
                    <button
                      className="bg-gray-300 px-2 rounded"
                      onClick={() => handleQuantityChange(item._id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-300 px-2 rounded"
                      onClick={() => handleQuantityChange(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="mt-3 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['address', 'city', 'state', 'country', 'pincode', 'phoneNo'].map(field => (
                <input
                  key={field}
                  type={field === 'pincode' || field === 'phoneNo' ? 'number' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shippingInfo[field]}
                  onChange={handleShippingChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-right">
            <h3 className="text-xl font-bold mb-4">
              Total: ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </h3>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
