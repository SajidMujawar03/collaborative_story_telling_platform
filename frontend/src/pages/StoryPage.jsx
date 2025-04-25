import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../axiosConfig.js";

const StoryPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState({}); // Track votes
  const [sortOrder, setSortOrder] = useState('upvotes');
  const [showSelected, setShowSelected] = useState(true); // State to toggle selected contributions visibility
  const bottomRef = useRef(null);

  const token = localStorage.getItem('token'); // Get token from localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

  // Fetch story and contributions data
  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in request headers
        },
      });
      const cleanContent = res.data.content.map(c => ({
        ...c,
        contributedBy: c.contributedBy || res.data.createdBy,
      }));
      setStory({ ...res.data, content: cleanContent });

      const contribRes = await axios.get(`/api/contributions/story/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in request headers
        },
      });
      setContributions(contribRes.data);

      // Track the user's previous votes for each contribution
      const votes = {};
      contribRes.data.forEach((contribution) => {
        if (contribution.upvotedBy.includes(user._id)) {
          votes[contribution._id] = 'upvote';
        } else if (contribution.downvotedBy.includes(user._id)) {
          votes[contribution._id] = 'downvote';
        }
      });
      setUserVotes(votes);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      console.log("User is not authenticated");
    }
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
      console.log(err)
      console.error("Error voting:", err);
    }
  };

  const sortedContributions = [...contributions].sort((a, b) => {
    switch (sortOrder) {
      case 'upvotes':
        return b.upvotes - a.upvotes; // Sort by upvotes
      case 'downvotes':
        return b.downvotes - a.downvotes; // Sort by downvotes
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by contribution date
      default:
        return 0;
    }
  });

  const filteredContributions = sortedContributions.filter(contribution => 
    showSelected ? true : !contribution.isSelected
  );

  if (!story) return (
    <div className="text-center mt-10">
      <p className="text-lg text-gray-600 animate-pulse">Loading story...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700">{story.title}</h1>
      <p className="text-gray-600 mt-1 mb-6">By: <span className="font-semibold">{story.createdBy?.name || "Unknown"}</span></p>
  
      {/* Story Content */}
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md space-y-4 border border-blue-100">
        {story.content.map((c, index) => (
          <div key={index} className={`p-3 rounded-lg ${c.selected ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white'}`}>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{c.text}</p>
            <p className="text-sm text-gray-500 mt-1">— {c.contributedBy?.name || story.createdBy?.name || "Unknown"}</p>
          </div>
        ))}
      </div>
  
      {/* Contribute Section */}
      <h2 className="text-3xl font-extrabold text-blue-700 mt-12 mb-4 flex items-center gap-2">
        💡 Contribute
      </h2>

      {story.status === "closed" ? (
        <p className="text-red-700 bg-red-100 border border-red-200 p-4 rounded-xl font-semibold shadow-sm">
          🚫 This story is closed for new contributions.
        </p>
      ) : (
        <form
          onSubmit={handleContribute}
          className="group bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100 transition duration-300 hover:border-blue-300"
        >
          <textarea
            placeholder="Write your continuation of the story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg min-h-[140px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "✍️ Submit Contribution"}
            </button>
          </div>
        </form>
      )}

      {/* Contributions */}
      <div>
        <h2 className="text-2xl font-bold mt-10 mb-4">🗳️ Contributions</h2>

        {/* Sort buttons */}
        <div className="mb-4">
          <button
            onClick={() => setSortOrder('upvotes')}
            className="mr-3 text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sort by Upvotes
          </button>
          <button
            onClick={() => setSortOrder('downvotes')}
            className="mr-3 text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sort by Downvotes
          </button>
          <button
            onClick={() => setSortOrder('date')}
            className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sort by Date
          </button>
        </div>

        {/* Toggle buttons for showing selected or non-selected contributions */}
        <div className="mb-4">
          <button
            onClick={() => setShowSelected(!showSelected)}
            className="text-sm px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
          >
            {showSelected ? 'Hide Selected Contributions' : 'Show Selected Contributions'}
          </button>
        </div>

        {/* No contributions message */}
        {filteredContributions.length === 0 ? (
          <p className="text-gray-500">No contributions yet. Be the first!</p>
        ) : (
          filteredContributions.map(c => (
            <div
              key={c._id}
              className={`p-5 rounded-xl shadow-sm mb-4 border transition-all duration-200 ${
                c.isSelected ? 'bg-green-50 border-green-300' : 'bg-white hover:shadow-md'
              }`}
            >
              <p className="text-gray-800 whitespace-pre-wrap">{c.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                By: {c.contributedBy?.name || 'Unknown'}
              </p>

              {/* Display the formatted contribution date */}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => handleVote(c._id, 'upvote')}
                  className={`text-sm px-2 py-1 rounded transition ${
                    userVotes[c._id] === 'upvote'
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-green-50 text-green-600'
                  }`}
                  disabled={userVotes[c._id] === 'upvote' || story.status === 'closed'}
                >
                  👍 {c.upvotes}
                </button>
                <button
                  onClick={() => handleVote(c._id, 'downvote')}
                  className={`text-sm px-2 py-1 rounded transition ${
                    userVotes[c._id] === 'downvote'
                      ? 'bg-red-100 text-red-700'
                      : 'hover:bg-red-50 text-red-600'
                  }`}
                  disabled={userVotes[c._id] === 'downvote' || story.status === 'closed'}
                >
                  👎 {c.downvotes}
                </button>

                {user?._id === story.createdBy._id && !c.isSelected && story.status !== 'closed' && (
                  <button
                    onClick={() => handleSelect(c._id)}
                    className="ml-auto text-blue-600 hover:underline font-semibold"
                  >
                    ✅ Select
                  </button>
                )}

                {c.isSelected && (
                  <span className="ml-auto text-green-700 font-semibold">✅ Selected</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default StoryPage;
