import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Main footer section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About YT Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An advanced YouTube analytics tool designed to help content creators understand their performance metrics,
              engagement rates, and revenue potential. Gain insights that YouTube doesn't directly provide.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Created by <span className="text-red-500 font-semibold">Fıratcan Şahin</span>
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/video-analytics" className="hover:text-red-500 transition-colors text-sm">Video Analytics</Link>
              </li>
              <li>
                <Link to="/channel-analytics" className="hover:text-red-500 transition-colors text-sm">Channel Analytics</Link>
              </li>
              <li>
                <Link to="/channel-finder" className="hover:text-red-500 transition-colors text-sm">Channel ID Finder</Link>
              </li>
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Features</h3>
            <ul className="text-gray-400 space-y-2">
              <li className="text-sm">• Engagement Rate Analysis</li>
              <li className="text-sm">• Revenue Estimation</li>
              <li className="text-sm">• Channel Growth Tracking</li>
              <li className="text-sm">• Hidden Metrics Analysis</li>
              <li className="text-sm">• PDF and Excel Export</li>
              <li className="text-sm">• Historical Data Comparison</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and extra links */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} YT Analytics by Fıratcan Şahin. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/firatcansahin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/firatcansahin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="mailto:hello@firatcansahin.com" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 