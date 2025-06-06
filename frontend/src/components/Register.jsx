import { useState } from 'react';

function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      fullname,
      email,
      phoneNumber,
      password,
      role,
    };

    try {
      const response = await fetch('http://localhost:4000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration Successful!');
        setFullname('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setRole('user');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl text-center text-gray-800 font-semibold mb-6">Create an Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="fullname" className="block text-sm text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="fullname"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
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
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm text-gray-700 mb-1">Select Role</label>
          <select
            id="role"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_operator">Store Operator</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300"
        >
          Register
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
