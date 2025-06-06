import React from 'react';
import { useUser } from "../context/UserContext";
import logo from '../assets/logo.png';

const Home = () => {
  const { user } = useUser();  

  return (
    <div className="font-sans px-5 text-center mt-24 bg-[#f4f4f9]">
      <h1 className="text-[#2c3e50] text-4xl font-bold mb-5">
        <span className="text-[#e0a80e]">Welcome to </span>
        <img src={logo} alt="ZipZap" className="inline-block h-10 mx-2 align-middle" />
        <span className="text-[rgba(9,125,34,0.833)]">Your Instant Delivery Solution!</span>
      </h1>
      <p className="text-[rgb(98,97,97)] text-lg leading-relaxed max-w-3xl mx-auto px-5 text-justify">
        At ZipZap, we understand that time is of the essence. In today’s fast-paced world, we believe that your products should reach you in the blink of an eye. Our cutting-edge system connects you to the nearest Dark Store, ensuring that your order is fulfilled and dispatched in the shortest time possible. With real-time updates, quick delivery executives, and an easy-to-use interface for store operators, ZipZap makes online shopping faster and more efficient than ever before.
      </p>
    </div>
  );
};

export default Home;
