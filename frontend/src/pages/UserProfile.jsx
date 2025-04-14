// pages/UserProfile.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await axios.get(`/api/users/profile/${id}`);
      setUser(resUser.data);
      const resStories = await axios.get(`/api/stories?user=${id}`);
      setStories(resStories.data);
    };
    fetchData();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center gap-4 mb-6">
        <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">📝 Stories by {user.name}</h2>
      {stories.map(story => (
        <div key={story._id} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold">{story.title}</h3>
          <p>{story.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
