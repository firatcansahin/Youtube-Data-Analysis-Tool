import React from 'react';

const SearchHistory = ({ 
  history, 
  onSelect, 
  onClear,
  visible,
  toggleVisibility,
  dataType = 'video' // 'video' or 'channel'
}) => {
  // If no history or not visible, don't render
  if (!history || history.length === 0 || !visible) {
    return null;
  }
  
  // Format timestamp to readable date
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get item title or a default display
  const getItemTitle = (item) => {
    if (!item) return 'Unknown';
    
    if (dataType === 'video') {
      return item.title || `Video ${item.id?.substring(0, 8)}...`;
    } else {
      return item.title || `Channel ${item.id?.substring(0, 8)}...`;
    }
  };
  
  // Get appropriate icon based on data type
  const getIcon = (item) => {
    if (dataType === 'video') {
      return (
        <svg className="w-5 h-5 text-youtube-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm7 1a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-youtube-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Recent Searches
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={toggleVisibility} 
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={onClear} 
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
            title="Clear search history"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
        {history.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
            onClick={() => onSelect(item)}
          >
            {getIcon(item.data)}
            <div className="ml-3 overflow-hidden">
              <p className="text-white font-medium truncate">{getItemTitle(item.data)}</p>
              <p className="text-gray-400 text-sm">{formatTime(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default SearchHistory; 