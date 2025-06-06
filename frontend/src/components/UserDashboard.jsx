import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function UserDashboard() {
  const { addToCart, updateCart } = useCart();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    axios
      .get('http://localhost:4000/api/v1/product/getAllProducts')
      .then(response => {
        if (isMounted) {
          setProducts(response.data.products);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('Failed to load products');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const handleIncrease = (productId) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const handleDecrease = (productId) => {
    const updatedCart = cartItems
      .map(item =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const getQuantity = (productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

 

  if (loading) return <p className="text-center text-gray-600">Loading products…</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 p-6 max-w-6xl mx-auto">
        {products.map(p => {
          const quantity = getQuantity(p._id);
          return (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-200 transform hover:-translate-y-1 flex flex-col"
            >
              <img
                src={p.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={p.name}
                className="w-full h-[150px] object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col justify-between flex-1 items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.weight}</p>
                <p className="text-sm text-gray-600 mb-2">₹{p.price}</p>

                {quantity === 0 ? (
                  <button
                    onClick={() => { handleAddToCart(p); }}
                    className="mt-3 bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center flex-auto gap-10 ">
                    <button
                      onClick={() => handleDecrease(p._id)}
                      className="bg-red-500 hover:bg-red-700 text-white w-12 h-12 rounded-xl text-3xl font-bold pb-2"
                    >
                      –
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => handleIncrease(p._id)}
                      className="bg-green-500 hover:bg-green-700 text-white w-12 h-12 rounded-xl text-3xl font-bold pb-2"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserDashboard;
