// pages/CreateStoryPage.jsx
import { useState } from 'react';
import axios from "../../axiosConfig.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx';

const CreateStoryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Trim trailing spaces from each line but preserve spacing, gaps, line breaks
      const cleanedContent = content
        .split('\n')
        .map(line => line.replace(/\s+$/, '')) // remove trailing spaces
        .join('\n');
  
      await axios.post('/api/stories', {
        title: title.trim(),
        text: cleanedContent,
        createdBy: user._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">📝 Create a New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story's title"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Start Writing</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Once upon a time..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl h-48 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300 shadow-md"
          >
            Publish Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryPage;
