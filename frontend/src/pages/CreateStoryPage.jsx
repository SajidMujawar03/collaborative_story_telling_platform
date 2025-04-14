// pages/CreateStoryPage.jsx
import { useState } from 'react';
import axios from "../../axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx';

const CreateStoryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const {user}=useAuth()

  const token = localStorage.getItem('token');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      console.log(user)
      await axios.post('/api/stories', { title, text: content, createdBy:user._id}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">📝 Create New Story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Story Title" value={title}
          onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
        <textarea placeholder="Start the story..." value={content}
          onChange={(e) => setContent(e.target.value)} className="w-full border p-2 rounded h-40" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateStoryPage;
