import { useState } from 'react';
import axios from "../../axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const {login} =useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', { email, password });

      login(res.data.user,res.data.token)

      navigate('/');
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
