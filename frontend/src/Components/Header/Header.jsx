// components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';

const Header = () => {
  const {user,logout}=useAuth()
  const navigate = useNavigate();
  


  console.log(user)
  const handleLogout = () => {
    logout()
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          📝 Cowrite
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          {user && (
            <>
              <Link to="/create" className="hover:text-blue-500">Create</Link>
              <Link to={`/profile/${user._id}`} className="hover:text-blue-500">Profile</Link>
              <Link to="/my-stories" className="hover:text-blue-500">My Stories</Link>
              <Link to="/my-contributions" className="hover:text-blue-500">My Contributions</Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-500">Login</Link>
              <Link to="/register" className="hover:text-blue-500">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
