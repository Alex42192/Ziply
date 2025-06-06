import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

function Login() {
  const { login } = useUser();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        alert("Login successful!");

        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "store_operator") {
          navigate("/store-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error or server not responding");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    console.log("User from localStorage:", savedUser ? JSON.parse(savedUser) : null);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl text-center text-gray-800 font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
