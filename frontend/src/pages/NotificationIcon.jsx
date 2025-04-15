import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have auth context to get user info

const NotificationIcon = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${user._id}`);
      setNotifications(response.data);
      console.log(response);
      
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      // Initial fetch of notifications
      fetchNotifications();
      // Set up polling to fetch new notifications every 10 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 10000); // Poll every 10 seconds

      // Cleanup on component unmount
      return () => clearInterval(interval);
    }
  }, [user]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}`, { isRead: true });
      // Update the state to reflect the read status
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(unreadCount - 1); // Decrease unread count
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative text-gray-700 hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 10l-7 7-7-7"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs font-bold px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-md z-10">
          <div className="px-4 py-2 text-gray-500 font-bold">Notifications</div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-400">No new notifications.</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`p-4 ${notification.isRead ? 'bg-gray-100' : 'bg-gray-200'} hover:bg-gray-300 cursor-pointer`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <Link to={notification.link} className="block">
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <small className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleTimeString()}</small>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <div className="border-t p-2 text-center">
            <Link to="/notifications" className="text-blue-600">See All</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
