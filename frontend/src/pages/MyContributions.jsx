import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";
import { Link } from 'react-router-dom';

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await axios.get(`/api/contributions/user/${user._id}`);
        setContributions(res.data);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    };
    fetchContributions();
  }, [user._id]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">✍️ My Contributions</h1>

        {contributions.length === 0 ? (
          <p className="text-center text-lg text-gray-500">You have not made any contributions yet.</p>
        ) : (
          contributions.map(contrib => (
            <div
              key={contrib._id}
              className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{contrib.content}</p>

              <p className="text-sm text-gray-500">
                Story:{" "}
                <Link
                  to={`/story/${contrib.story._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {contrib.story.title}
                </Link>
              </p>

              <p
                className={`text-sm font-semibold mt-2 ${
                  contrib.isSelected ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {contrib.isSelected ? '✅ Selected' : '⌛ Pending'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyContributions;
