import React, { useState } from 'react';

const RefreshDataButton = ({ onRefresh, tooltipText = "Refresh data" }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const success = await onRefresh();
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      title={tooltipText}
    >
      <svg 
        className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      {showSuccess ? 'Updated!' : 'Refresh'}
    </button>
  );
};

export default RefreshDataButton; 