import React from 'react';
import { Link } from 'react-router-dom';

const HistoryList = ({ searchHistory, onClearHistory }) => {
  if (!searchHistory || searchHistory.length === 0) {
    return (
      <div className="bg-youtube-gray p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Searches</h2>
        <p className="text-youtube-light-gray">No recent searches found.</p>
      </div>
    );
  }

  // Create relative time string (e.g. "2 hours ago")
  const getRelativeTimeString = (timestamp) => {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - searchTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-youtube-gray p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Recent Searches</h2>
        <button 
          onClick={onClearHistory}
          className="text-youtube-light-gray hover:text-white text-sm"
        >
          Clear All
        </button>
      </div>
      
      <div className="divide-y divide-gray-700">
        {searchHistory.map((item) => (
          <div key={item.id} className="py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-white text-sm font-medium truncate max-w-xs">{item.title}</h3>
                <div className="flex items-center text-xs text-youtube-light-gray">
                  <span>{getRelativeTimeString(item.timestamp)}</span>
                  <span className="mx-1">•</span>
                  <span>{item.searchType || 'Video'} Analysis</span>
                </div>
              </div>
            </div>
            
            <Link 
              to={`/video/${item.resultId}`}
              className="bg-youtube-red hover:bg-red-700 text-white text-xs py-1 px-3 rounded transition-colors"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList; 