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

  const handleStatusToggle = async (storyId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await axios.patch(`/api/stories/${storyId}/status`, { status: newStatus });
      setStories(prev =>
        prev.map(story =>
          story._id === storyId ? { ...story, status: newStatus } : story
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredStories = stories.filter(story => {
    if (filter === 'all') return true;
    return story.status === filter;
  });

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📓 My Stories</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setFilter('all')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full transition duration-200">
          All
        </button>
        <button onClick={() => setFilter('open')} className="bg-green-200 hover:bg-green-300 text-green-700 px-5 py-2 rounded-full transition duration-200">
          Open
        </button>
        <button onClick={() => setFilter('closed')} className="bg-red-200 hover:bg-red-300 text-red-700 px-5 py-2 rounded-full transition duration-200">
          Closed
        </button>
      </div>

      {/* Stories List */}
      {filteredStories.length === 0 ? (
  <p className="text-center text-xl font-medium text-gray-500 mt-10">No stories match your filter criteria.</p>
) : (
  filteredStories.map(story => (
    <div
      key={story._id}
      className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-6 hover:shadow-md hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <h2 className="text-2xl font-semibold text-gray-800">{story.title}</h2>
      <p className="text-gray-600 mt-2">
        {story.content?.[0]?.text?.substring(0, 100)}...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Status: <span className={`font-semibold ${story.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>{story.status}</span>
      </p>

      <div className="flex justify-between items-center mt-4">
        <Link to={`/story/${story._id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Manage / View
        </Link>
        <button
          onClick={() => handleStatusToggle(story._id, story.status)}
          className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all duration-200"
        >
          Mark as {story.status === 'open' ? 'Closed' : 'Open'}
        </button>
      </div>
    </div>
  ))
)}


    </div>
  );
};

export default MyStories;
