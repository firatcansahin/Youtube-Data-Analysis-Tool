import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const ChannelFinderPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelData, setChannelData] = useState(null);

  // Process input and fetch channel data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube channel URL or username');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const channelId = extractChannelId(url);
      
      if (!channelId) {
        setError('Unable to extract channel information from the provided URL or username');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`/api/channel?channelId=${channelId}`);
      setChannelData(response.data);
    } catch (err) {
      console.error('Error finding channel:', err);
      setError(err.response?.data?.error || 'Failed to find channel information');
    } finally {
      setLoading(false);
    }
  };

  // Extract channel ID from various URL formats
  const extractChannelId = (url) => {
    // Clean the URL
    const cleanUrl = url.trim();
    
    // Handle direct channel ID input (starts with UC and is 24 characters)
    if (/^UC[\w-]{22}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    // Handle /channel/ format
    if (cleanUrl.includes('/channel/')) {
      const parts = cleanUrl.split('/channel/');
      if (parts[1]) {
        const idPart = parts[1].split('?')[0].split('/')[0];
        return idPart;
      }
    }
    
    // Handle /c/ or /user/ or @ format 
    if (cleanUrl.includes('/c/') || cleanUrl.includes('/user/') || cleanUrl.includes('@')) {
      // For these formats, we'll extract the custom name and return it
      let customName = '';
      
      if (cleanUrl.includes('/c/')) {
        const parts = cleanUrl.split('/c/');
        customName = parts[1]?.split('?')[0].split('/')[0];
      } else if (cleanUrl.includes('/user/')) {
        const parts = cleanUrl.split('/user/');
        customName = parts[1]?.split('?')[0].split('/')[0];
      } else if (cleanUrl.includes('@')) {
        const parts = cleanUrl.split('@');
        customName = parts[1]?.split('?')[0].split('/')[0];
      }
      
      if (customName) {
        return customName;
      }
    }
    
    // If the URL doesn't match any of the above formats but appears to be a plain channel name
    if (!/\s/.test(cleanUrl) && !cleanUrl.includes('http')) {
      return cleanUrl;
    }
    
    return null;
  };

  // Copy text to clipboard with visual feedback
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard!', {
          duration: 2000,
          style: { background: '#4BB543', color: 'white' }
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy text');
      }
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold text-center mb-2 text-white">YouTube Channel ID Finder</h1>
      <p className="text-gray-400 text-center mb-8">Find the channel ID from any YouTube channel URL or username</p>
      
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube channel URL or username (e.g., https://www.youtube.com/@firatcans or firatcans)"
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-youtube-red"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finding...</span>
              </div>
            ) : (
              'Find Channel ID'
            )}
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8 animate-pulse">
          <p>{error}</p>
        </div>
      )}
      
      {/* Result card */}
      {channelData && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <img
                src={channelData.thumbnails?.high?.url || channelData.thumbnails?.default?.url || 'https://via.placeholder.com/120'}
                alt={channelData.title || 'Channel thumbnail'}
                className="w-24 h-24 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{channelData.title || 'Unknown Channel'}</h2>
                
                <div className="text-gray-400 space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-500">Created: </span>
                    {channelData.publishedAt ? new Date(channelData.publishedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                  
                  {channelData.statistics && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Subscribers: </span>
                        {parseInt(channelData.statistics.subscriberCount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Videos: </span>
                        {parseInt(channelData.statistics.videoCount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Views: </span>
                        {parseInt(channelData.statistics.viewCount || 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Channel Details</h3>
            
            {/* Channel ID */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Channel ID</h4>
                  <p className="text-white font-mono bg-gray-900 p-2 rounded mb-2">{channelData.id}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(channelData.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                  </svg>
                  Copy ID
                </button>
              </div>
            </div>
            
            {/* Channel URL */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Channel URL (with ID)</h4>
                  <p className="text-white font-mono bg-gray-900 p-2 rounded mb-2 break-all">
                    https://www.youtube.com/channel/{channelData.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(`https://www.youtube.com/channel/${channelData.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                    </svg>
                    Copy URL
                  </button>
                  <a
                    href={`https://www.youtube.com/channel/${channelData.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                    Visit
                  </a>
                </div>
              </div>
            </div>
            
            {/* Custom URL (if available) */}
            {channelData.customUrl && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Custom URL</h4>
                    <p className="text-white font-mono bg-gray-900 p-2 rounded mb-2 break-all">
                      https://www.youtube.com/{channelData.customUrl}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(`https://www.youtube.com/${channelData.customUrl}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </svg>
                      Copy URL
                    </button>
                    <a
                      href={`https://www.youtube.com/${channelData.customUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Studio URL */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">YouTube Studio URL</h4>
                  <p className="text-white font-mono bg-gray-900 p-2 rounded mb-2 break-all">
                    https://studio.youtube.com/channel/{channelData.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(`https://studio.youtube.com/channel/${channelData.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                    </svg>
                    Copy URL
                  </button>
                  <a
                    href={`https://studio.youtube.com/channel/${channelData.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                    Visit Studio
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-700 text-center">
            <a 
              href={`/channel/${channelData.id}`}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
              </svg>
              Analyze This Channel
            </a>
          </div>
        </div>
      )}
      
      {/* Helper information box */}
      <div className="mt-10 p-6 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">About Channel IDs</h3>
        <p className="text-gray-400 mb-4">
          Every YouTube channel has a unique ID that starts with "UC" followed by 22 characters. 
          This ID is used in YouTube's API and remains constant even if the channel changes its name or custom URL.
        </p>
        
        <h4 className="text-md font-semibold text-white mb-2">Accepted Input Formats:</h4>
        <ul className="list-disc pl-5 text-gray-400 space-y-1 mb-4">
          <li>Full channel URLs: https://www.youtube.com/channel/UC...</li>
          <li>Custom URLs: https://www.youtube.com/c/ChannelName</li>
          <li>Handle URLs: https://www.youtube.com/@HandleName</li>
          <li>User URLs: https://www.youtube.com/user/Username</li>
          <li>Direct channel ID: UC...</li>
          <li>Channel name or handle: ChannelName or @HandleName</li>
        </ul>
        
        <div className="text-gray-500 text-sm italic">
          <p>Note: For custom URLs (c/ChannelName), handles (@HandleName), or usernames (user/Username), the tool will first resolve these to the actual channel ID.</p>
        </div>
      </div>
      
      {/* Footer with credits */}
      <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>Created by Fıratcan Şahin</p>
        <p>YouTube Analytics Tool - All rights reserved</p>
      </div>
    </div>
  );
};

export default ChannelFinderPage; 