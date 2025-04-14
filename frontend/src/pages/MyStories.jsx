// pages/MyStories.jsx
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from 'react-router-dom';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStories = async () => {
      const res = await axios.get(`/api/stories?user=${user._id}`);
      setStories(res.data);
    };
    fetchStories();
  }, [user._id]);

  const filteredStories = stories.filter(story => {
    if (filter === 'all') return true;
    if (filter === 'open') return !story.fullContent;
    if (filter === 'closed') return !!story.fullContent;
  });

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">📓 My Stories</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter('all')} className="border px-3 py-1 rounded">All</button>
        <button onClick={() => setFilter('open')} className="border px-3 py-1 rounded">Open</button>
        <button onClick={() => setFilter('closed')} className="border px-3 py-1 rounded">Closed</button>
      </div>

      {filteredStories.map(story => (
        <div key={story._id} className="border p-4 mb-4 rounded">
          <h2 className="text-lg font-semibold">{story.title}</h2>
          <p className="text-gray-600 mb-1">{story.content.substring(0, 80)}...</p>
          <Link to={`/story/${story._id}`} className="text-blue-600 hover:underline">Manage / View</Link>
        </div>
      ))}
    </div>
  );
};

export default MyStories;
