// pages/UserProfile.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from "react-router-dom"; // at the top of your file
import avatar from "../assets/default-avatar.jpg"

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStories = async () => {
      try {
        setLoading(true);

        const resUser = await axios.get(`/api/users/profile/${id}`);
        setUser(resUser.data);

        const resStories = await axios.get(`/api/stories?user=${id}`);
        setStories(resStories.data);
      } catch (err) {
        console.error("Error fetching user/stories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStories();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
    {/* User Info */}
    <div className="flex items-center gap-6 mb-10 border-b pb-6 bg-white rounded-xl shadow-md p-6">
      <img
        src={user.avatar || avatar}
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
      />
      <div>
        <h1 className="text-4xl font-extrabold text-blue-700">{user.name}</h1>
        <p className="text-gray-500 text-lg">{user.email}</p>
      </div>
    </div>
  
    {/* Stories */}
    <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Stories by {user.name}</h2>
  
    {stories.length === 0 ? (
      <p className="text-gray-500 italic">No stories created yet.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{story.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {story.content.length > 0
                ? story.content.map(part => part.text).join(' ').substring(0, 140) + "..."
                : "No content yet."}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              📅 {new Date(story.createdAt).toLocaleDateString()}
            </p>
  
            <Link
              to={`/full-story/${story._id}`}
              className="inline-block text-sm text-blue-600 hover:underline font-medium"
            >
              View Full Story →
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
  
  );
};

export default UserProfile;
