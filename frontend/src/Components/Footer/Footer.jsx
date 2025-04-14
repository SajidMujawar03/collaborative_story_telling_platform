// components/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-700 py-4 mt-10 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} CollabStory. All rights reserved.</p>
          <p className="text-sm">Made with 💙 by Tony</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  