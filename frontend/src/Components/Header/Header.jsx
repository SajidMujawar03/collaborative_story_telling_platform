import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';
import logo from "../../assets/logo.png";
import NotificationIcon from '../../pages/NotificationIcon'; // Import NotificationIcon

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold text-blue-600 flex items-center space-x-2">
          <img src={logo} alt="CoWrite Logo" className="h-8" />
          <span>CoWrite</span>
        </Link>

        <nav className="flex space-x-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-blue-500 transition duration-200">Home</Link>

          {user ? (
            <>
              <Link to="/create" className="hover:text-blue-500 transition duration-200">Create</Link>
              <Link to={`/profile/${user._id}`} className="hover:text-blue-500 transition duration-200">Profile</Link>
              <Link to="/my-stories" className="hover:text-blue-500 transition duration-200">My Stories</Link>
              <Link to="/my-contributions" className="hover:text-blue-500 transition duration-200">My Contributions</Link>

              {/* Notification Icon */}
              {/* <NotificationIcon /> */}

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500 transition duration-200">Login</Link>
              {/* <Link to="/register" className="hover:text-blue-500 transition duration-200">Register</Link> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
