import { useState } from 'react';
import axios from "../../axiosConfig.js";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', avatar: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', formData);
      const loginRes = await axios.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      navigate('/');
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name}
          onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email}
          onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={formData.password}
          onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="avatar" placeholder="Avatar URL (optional)" value={formData.avatar}
          onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
