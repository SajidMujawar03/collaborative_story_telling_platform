// components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-1 animate-fade-in">
        <p className="text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold text-blue-600">CollabStory</span>. All rights reserved.</p>
        <p className="text-xs text-gray-500">Made with 💙 by <span className="font-medium">Tony</span></p>
      </div>
    </footer>
  );
};

export default Footer;
