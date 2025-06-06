import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from "lucide-react";

function Header() {
  const { user, logout } = useUser();
  const { getTotalCount } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(getTotalCount());

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setIsLoggedIn(!!savedUser);

    // Update cart count whenever cart changes
    setCartCount(getTotalCount());
  }, [user, getTotalCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
  };

  return (
    <header className="w-full bg-[#e0e5ec] shadow-xl shadow-gray-400 rounded-bl-lg rounded-br-lg">
      <nav className="flex justify-between items-center p-4">

        {/* Not Logged In */}
        {!isLoggedIn && (
          <>
            <>
              <div className="cursor-pointer" onClick={() => navigate('/')}>
                <img src={logo} alt="ZipZap" className="w-24" />
              </div>
              <div className="flex gap-3">
                <Link to="/login">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Login</button>
                </Link>
                <Link to="/register">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Register</button>
                </Link>
              </div>
          </>
          </>
        )}

        {/* Logged In User */}
        {isLoggedIn && user?.role === 'user' && (
          <>
            
            <div onClick={() => navigate('/user-dashboard')} className="cursor-pointer">
              <img src={logo} alt="ZipZap" className="w-20 h-12" />
            </div>

            <div className="flex items-center bg-gray-300 rounded-full h-10">
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Items..."
                  className="w-96 focus:outline-none px-4"
                />
              </form>
            </div>


            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi, {user?.fullname}</span>


              {/* New Go to Cart Button with count */}
              <Link to={'/cart'} className='relative'>
                <ShoppingCart className="h-8 w-8" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
          
              </Link>
              
              <button onClick={handleLogout} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Logout
              </button>
            </div>
          </>
        )}

        {/* Admin */}
        {isLoggedIn && user?.role === 'admin' && (
          <>
            <img src={logo} alt="ZipZap" className="w-24" />
            <div>
              <Link to="/admin-dashboard" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi Admin, {user?.fullname}</span>
              <button onClick={handleLogout} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Logout
              </button>
            </div>
          </>
        )}

        {/* Store Operator */}
        {isLoggedIn && user?.role === 'store_operator' && (
          <>
            <div onClick={() => navigate('/store-dashboard')} className="cursor-pointer">
              <img src={logo} alt="ZipZap" className="w-24" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi Operator, {user?.fullname}</span>
              <button onClick={handleLogout} className='bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-white'>
                Logout
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
