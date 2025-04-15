import { useState } from 'react';
import axios from "../../axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-[81vh] flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
      <div className="w-full max-w-md p-4 space-y-6 bg-white shadow-2xl rounded-3xl border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-green-700">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm">Log in to continue to your dashboard</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition duration-300 shadow-md"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center">Don't have an account? <a href="/register" className="text-green-600 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
