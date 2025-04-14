// pages/StoryPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../axiosConfig.js";

const StoryPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/stories/${id}`);
      const cleanContent = res.data.content.map(c => ({
        ...c,
        contributedBy: c.contributedBy || res.data.createdBy
      }));
      setStory({ ...res.data, content: cleanContent });

      const contribRes = await axios.get(`/api/contributions/story/${id}`);
      setContributions(contribRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contributions]);

  const handleContribute = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `/api/stories/${id}/contribute`,
        { text: content, contributedBy: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchData();
    } catch (err) {
      console.error("Error submitting contribution:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = async (contributionId) => {
    try {
      await axios.post(
        `/api/stories/${id}/select/${contributionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error selecting contribution:", err);
    }
  };

  const handleVote = async (contributionId, type) => {
    try {
      await axios.post(
        `/api/contributions/${contributionId}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  if (!story) return (
    <div className="text-center mt-10">
      <p className="text-lg text-gray-600 animate-pulse">Loading story...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">{story.title}</h1>
      <p className="text-gray-700 mt-2">By: {story.createdBy?.name || "Unknown"}</p>

      {/* Display story content */}
      <div className="bg-gray-100 p-4 mt-4 rounded space-y-2">
        {story.content.map((c, index) => (
          <div key={index} className={`${c.selected ? 'bg-green-100 border-l-4 border-green-500 pl-2' : ''}`}>
            <p>{c.text}</p>
            <p className="text-sm text-gray-600">
              — {c.contributedBy?.name || story.createdBy?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">💡 Contribute</h2>
      <form onSubmit={handleContribute} className="space-y-2">
        <textarea
          placeholder="Your paragraph..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded h-32"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Contribution"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-6">🗳️ Contributions</h2>
      {[...contributions].sort((a, b) => b.upvotes - a.upvotes).map(c => (
        <div key={c._id} className="border p-3 mt-4 rounded shadow-sm bg-white">
          <p className="mb-2">{c.text}</p>
          <p className="text-sm text-gray-500">By: {c.contributedBy?.name || "Unknown"}</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleVote(c._id, 'upvote')}
              className="text-green-600 hover:underline"
            >
              👍 {c.upvotes}
            </button>
            <button
              onClick={() => handleVote(c._id, 'downvote')}
              className="text-red-600 hover:underline"
            >
              👎 {c.downvotes}
            </button>
            {user?._id === story.createdBy._id && !c.isSelected && (
              <button
                onClick={() => handleSelect(c._id)}
                className="text-blue-600 hover:underline ml-auto"
              >
                ✅ Select
              </button>
            )}
            {c.isSelected && <span className="text-sm font-bold text-green-700 ml-auto">✅ Selected</span>}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default StoryPage;
