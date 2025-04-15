import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStories, setFilteredStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('/api/stories');
        setStories(res.data);
        setFilteredStories(res.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  // Filter stories based on search input
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filtered = stories.filter(story => {
      const storyTitle = story.title.toLowerCase();
      const creatorName = story.createdBy.name.toLowerCase();
      const isOpen = story.content.some(content => content.selected);  // If selected content exists, it's considered "open"
      
      return (
        storyTitle.includes(searchTerm) ||
        creatorName.includes(searchTerm) ||
        (isOpen && "open".includes(searchTerm)) ||
        (!isOpen && "closed".includes(searchTerm))
      );
    });

    setFilteredStories(filtered);
  };

  // Clear the search input
  const handleClearSearch = () => {
    setSearch('');
    setFilteredStories(stories);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 All Stories</h1>

      {/* Search Input */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by title, creator, or open/closed status"
          value={search}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={handleClearSearch}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Clear search"
          >
            ❌
          </button>
        )}
      </div>

      {/* No stories available message */}
      {filteredStories.length === 0 ? (
  <p className="text-center text-xl text-gray-500">No stories found matching your search.</p>
) : (
  filteredStories.map(story => (
    <div
      key={story._id}
      className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
    >
      <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600">{story.title}</h2>
      <p className="text-gray-600 mt-2">By: {story.createdBy.name}</p>
      
      {/* Display first selected or first content text (if any) */}
      {story.content.length > 0 && (
        <p className="mt-2 text-gray-700">
          {(story.content.find(c => c.selected)?.text || story.content[0]?.text).substring(0, 100)}...
        </p>
      )}

      {/* Display open/closed status */}
      <p className={`mt-2 ${story.content.some(content => content.selected) ? 'text-green-500' : 'text-red-500'}`}>
        {story.content.some(content => content.selected) ? 'Open' : 'Closed'}
      </p>

      {/* Separate Contribute and View links */}
      <div className="mt-4 flex justify-between">
        {/* Contribute Link */}
        <Link 
          to={`/story/${story._id}`} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Contribute
        </Link>

        {/* View Link */}
        <Link 
          to={`/full-story/${story._id}`} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View
        </Link>
      </div>
    </div>
  ))
)}

    </div>
  );
};

export default HomePage;
