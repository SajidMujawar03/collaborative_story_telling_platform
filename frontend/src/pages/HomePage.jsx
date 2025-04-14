// pages/HomePage.jsx
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('/api/stories');
        console.log(res.data);
        setStories(res.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">📚 All Stories</h1>
      {stories.map(story => (
        <div key={story._id} className="border p-4 rounded mb-4 shadow">
          <h2 className="text-xl font-semibold">{story.title}</h2>
          <p className="text-gray-600">By: {story.createdBy.name}</p>
          
          {/* Display first selected or first content text (if any) */}
          {story.content.length > 0 && (
            <p className="mt-2">
              {
                (story.content.find(c => c.selected)?.text || story.content[0]?.text).substring(0, 100)
              }
              ...
            </p>
          )}

          <Link 
            to={`/story/${story._id}`} 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View / Contribute
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
