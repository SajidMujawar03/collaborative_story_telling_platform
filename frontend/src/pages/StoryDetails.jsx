// pages/StoryDetails.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";

const StoryDetails = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`/api/stories/${id}`);
        setStory(res.data);
      } catch (err) {
        console.error("Error fetching story", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!story) return <div className="text-center mt-10">Story not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white shadow-xl rounded-2xl my-2">
    {/* Title */}
    <div className='p-1'>
  <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 pb-3 border-blue-600 hover:text-blue-600 transition-colors">
    {story.title}
  </h1>
  <p className="text-lg text-gray-700">Created By: <span className="font-semibold text-gray-800">{story.createdBy.name}</span></p>
</div>

    

  
    {/* Story Content */}
    <div className="space-y-6 text-lg text-gray-800 leading-relaxed">
      {story.content.map((part, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg ${
            part.selected ? 'bg-green-50 border-l-4 border-green-400' : 'bg-gray-50'
          }`}
        >
          <p>{part.text}</p>
          <p className="text-sm text-gray-500 mt-2 italic">
            — {part.contributedBy?.name || story.createdBy?.name || "Anonymous"}
          </p>
        </div>
      ))}
    </div>
  
    {/* Meta Info */}
    <p className="text-sm text-gray-500 mt-8 border-t pt-4">
      🗓️ Created on {new Date(story.createdAt).toLocaleDateString()}
    </p>
  </div>
  
  );
};

export default StoryDetails;
