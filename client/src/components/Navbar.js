import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Main nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <svg 
                className="w-8 h-8 text-red-600 fill-current" 
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span className="text-white font-bold text-xl">YT Analytics</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`text-sm ${isActiveRoute('/') ? 'text-red-500 font-semibold' : 'text-gray-300 hover:text-white'} transition-colors duration-200`}
              >
                Home
              </Link>
              <Link 
                to="/video-analytics" 
                className={`text-sm ${isActiveRoute('/video-analytics') ? 'text-red-500 font-semibold' : 'text-gray-300 hover:text-white'} transition-colors duration-200`}
              >
                Video Analytics
              </Link>
              <Link 
                to="/channel-analytics" 
                className={`text-sm ${isActiveRoute('/channel-analytics') ? 'text-red-500 font-semibold' : 'text-gray-300 hover:text-white'} transition-colors duration-200`}
              >
                Channel Analytics
              </Link>
              <Link 
                to="/channel-finder" 
                className={`text-sm ${isActiveRoute('/channel-finder') ? 'text-red-500 font-semibold' : 'text-gray-300 hover:text-white'} transition-colors duration-200`}
              >
                Channel Finder
              </Link>
            </div>
          </div>
          
          {/* Creator byline */}
          <div className="hidden md:flex items-center text-gray-400 text-sm">
            
            <a 
              href="/about" 
              rel="noopener noreferrer"
              className="ml-1 text-white hover:text-red-500 transition-colors duration-200"
            >
              About
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg 
                className="h-6 w-6 fill-current" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 bg-gray-800">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute('/') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/video" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute('/video') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Video Analytics
          </Link>
          <Link 
            to="/channel" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute('/channel') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Channel Analytics
          </Link>
          <Link 
            to="/channel-finder" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute('/channel-finder') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Channel Finder
          </Link>
          
          {/* Creator byline in mobile menu */}
          <div className="px-3 py-2 text-gray-400 text-sm flex items-center">
            <span>by</span>
            <a 
              href="https://github.com/firatcansahin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-white"
            >
              Fıratcan Şahin
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 