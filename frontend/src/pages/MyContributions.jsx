// pages/MyContributions.jsx
import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from 'react-router-dom';

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchContributions = async () => {
      const res = await axios.get(`/api/contributions/user/${user._id}`);
      setContributions(res.data);
    };
    fetchContributions();
  }, [user._id]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">✍️ My Contributions</h1>

      {contributions.map(contrib => (
        <div key={contrib._id} className="border p-4 mb-4 rounded">
          <p className="mb-2">{contrib.content}</p>
          <p className="text-sm text-gray-600">Story: <Link to={`/story/${contrib.story._id}`} className="text-blue-600 hover:underline">{contrib.story.title}</Link></p>
          <p className={`text-sm font-semibold ${contrib.isSelected ? 'text-green-700' : 'text-yellow-600'}`}>
            {contrib.isSelected ? '✅ Selected' : '⌛ Pending'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyContributions;
