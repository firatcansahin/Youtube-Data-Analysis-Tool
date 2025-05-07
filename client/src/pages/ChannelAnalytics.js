import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import VideoCard from '../components/VideoCard';
import EngagementRating from '../components/EngagementRating';
import PdfExportButton from '../components/PdfExportButton';
import ExcelExportButton from '../components/ExcelExportButton';
import RefreshDataButton from '../components/RefreshDataButton';
import HistoryList from '../components/HistoryList';
import { formatStatistics } from '../utils/analyticsUtils';
import ChannelExportButton from '../components/ChannelExportButton';
import SearchHistory from '../components/SearchHistory';
import ChannelEngagementCard from '../components/ChannelEngagementCard';
import '../App.css';

const ChannelAnalytics = () => {
  const [url, setUrl] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const contentRef = React.useRef(null);
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('channelSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing channel search history', e);
        localStorage.removeItem('channelSearchHistory');
      }
    }
  }, []);

  // If resultId is provided, try to fetch from history or API
  useEffect(() => {
    if (resultId) {
      // First check if it's in the history
      const savedHistory = localStorage.getItem('channelSearchHistory');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          const historyItem = history.find(item => item.resultId === resultId);
          
          if (historyItem && historyItem.channelId) {
            fetchChannelData(historyItem.channelId, false);
          }
        } catch (e) {
          console.error('Error finding history item', e);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId]);

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
    
    // Handle /c/ or /user/ format (need to fetch to resolve)
    if (cleanUrl.includes('/c/') || cleanUrl.includes('/user/') || cleanUrl.includes('@')) {
      // For these formats, we'll extract the custom name and return it for a different API call
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

  // Fetch channel data from API
  const fetchChannelData = async (channelId, saveToHistory = true) => {
    if (!channelId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/channel?channelId=${channelId}`);
      const data = response.data;
      setChannelData(data);
      
      // Generate a unique result ID and navigate to it
      if (saveToHistory) {
        const uniqueId = uuidv4().slice(0, 8);
        
        // Save to search history
        const newHistoryItem = {
          id: uuidv4(),
          resultId: uniqueId,
          channelId: channelId,
          title: data.title || 'Unknown Channel',
          thumbnail: data.thumbnails?.default?.url || '',
          timestamp: new Date().toISOString(),
          searchType: 'Channel',
          data: data
        };
        
        // Add to history and save to localStorage
        const updatedHistory = [newHistoryItem, ...searchHistory.filter(h => h.channelId !== channelId)].slice(0, 10); // Keep only 10 most recent
        setSearchHistory(updatedHistory);
        localStorage.setItem('channelSearchHistory', JSON.stringify(updatedHistory));
        
        // Navigate to the unique URL
        navigate(`/channel/${uniqueId}`);
      }
      
    } catch (err) {
      console.error('Error fetching channel data:', err);
      setError(err.response?.data?.error || 'Failed to fetch channel data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const channelId = extractChannelId(url);
    if (!channelId) {
      setError('Invalid YouTube channel URL. Please enter a valid channel URL.');
      return;
    }
    
    fetchChannelData(channelId);
  };

  // Refresh channel data
  const handleRefresh = async () => {
    if (channelData && channelData.id) {
      await fetchChannelData(channelData.id, false);
      return true;
    }
    return false;
  };

  // Clear search history
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('channelSearchHistory');
  };

  // Toggle history visibility
  const toggleHistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };
  
  // Handle history item selection
  const handleSelectHistory = (item) => {
    if (item && item.data) {
      setChannelData(item.data);
      if (item.channelId) {
        fetchChannelData(item.channelId, false);
      }
    }
  };

  const formatCount = (count) => {
    if (!count) return '0';
    
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Calculate estimated monthly growth
  const calculateGrowthEstimate = (channelData) => {
    if (!channelData) return null;
    
    const subscriberCount = parseInt(channelData.statistics.subscriberCount);
    const viewCount = parseInt(channelData.statistics.viewCount);
    const videoCount = parseInt(channelData.statistics.videoCount);
    
    // Channel age in days
    const channelCreated = new Date(channelData.publishedAt);
    const today = new Date();
    const channelAgeInDays = Math.floor((today - channelCreated) / (1000 * 60 * 60 * 24));
    
    // Calculate daily average metrics
    const dailySubscribers = subscriberCount / channelAgeInDays;
    const dailyViews = viewCount / channelAgeInDays;
    
    // Monthly estimates (30 days)
    const monthlySubscribers = Math.round(dailySubscribers * 30);
    const monthlyViews = Math.round(dailyViews * 30);
    
    // Videos per month
    const videosPerMonth = videoCount > 0 ? Math.round((videoCount / channelAgeInDays) * 30) : 0;
    
    return {
      monthlySubscribers,
      monthlyViews,
      videosPerMonth,
      channelAgeInDays
    };
  };
  
  // Calculate estimated revenue
  const calculateRevenueEstimate = (channelData) => {
    if (!channelData) return null;
    
    const viewCount = parseInt(channelData.statistics.viewCount);
    const subscriberCount = parseInt(channelData.statistics.subscriberCount);
    
    // Channel age in days
    const channelCreated = new Date(channelData.publishedAt);
    const today = new Date();
    const channelAgeInDays = Math.floor((today - channelCreated) / (1000 * 60 * 60 * 24));
    
    // Daily views
    const dailyViews = viewCount / channelAgeInDays;
    
    // Monthly views
    const monthlyViews = dailyViews * 30;
    
    // CPM range based on channel size
    let minCpm = 0.5;
    let maxCpm = 2.0;
    
    // Adjust CPM based on subscriber count (larger channels often get better CPM)
    if (subscriberCount > 1000000) {
      minCpm = 2.0;
      maxCpm = 7.0;
    } else if (subscriberCount > 100000) {
      minCpm = 1.0;
      maxCpm = 5.0;
    } else if (subscriberCount > 10000) {
      minCpm = 0.75;
      maxCpm = 3.0;
    }
    
    // Calculate monthly revenue range
    // Assume YouTube takes 45% cut, so creator gets 55%
    const minMonthlyRevenue = (monthlyViews / 1000) * minCpm * 0.55;
    const maxMonthlyRevenue = (monthlyViews / 1000) * maxCpm * 0.55;
    
    return {
      minMonthlyRevenue,
      maxMonthlyRevenue,
      minCpm,
      maxCpm
    };
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">YouTube Channel Analytics</h1>
      
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube channel URL (e.g., https://www.youtube.com/@firatcans)"
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
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analyze Channel'
            )}
          </button>
          <button
            type="button"
            onClick={toggleHistoryVisibility}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isHistoryVisible ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8 animate-pulse">
          <p>{error}</p>
        </div>
      )}
      
      {/* Search history */}
      <SearchHistory
        history={searchHistory}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
        visible={isHistoryVisible}
        toggleVisibility={toggleHistoryVisibility}
        dataType="channel"
      />
      
      {/* Channel data */}
      {channelData && (
        <div id="channelAnalyticsContent" className="bg-gray-900 rounded-xl p-6 shadow-xl">
          {/* Channel header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-700">
            <img
              src={channelData.thumbnails?.high?.url || channelData.thumbnails?.default?.url}
              alt={channelData.title || 'Channel thumbnail'}
              className="w-24 h-24 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{channelData.title || 'Unknown Channel'}</h2>
                  <p className="text-gray-400 mb-2">
                    {channelData.customUrl && (
                      <span className="inline-block bg-gray-800 text-gray-300 px-2 py-1 rounded mr-2">
                        {channelData.customUrl}
                      </span>
                    )}
                    <span className="text-sm">
                      Created: {channelData.publishedAt ? new Date(channelData.publishedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <ChannelExportButton channelData={channelData} elementId="channelAnalyticsContent" />
                  <ExcelExportButton data={channelData} dataType="channel" />
                  <RefreshDataButton onRefresh={handleRefresh} tooltipText="Refresh channel data" />
                </div>
              </div>
              
              <a 
                href={`https://www.youtube.com/channel/${channelData.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors duration-200 mt-2"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View on YouTube
              </a>
              <a 
                href={`https://studio.youtube.com/channel/${channelData.id}/analytics`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors duration-200 mt-2 ml-6"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
                </svg>
                YouTube Studio Analytics
              </a>
            </div>
          </div>
          
          {/* Channel stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Subscribers</h3>
              <p className="text-3xl font-bold text-white mb-1">
                {formatCount(channelData.statistics?.subscriberCount)}
              </p>
              <div className="text-sm text-gray-400 mt-2 flex items-center">
                <span className="mr-1">Detailed Analytics Available in YouTube Studio</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-white mb-1">
                {formatCount(channelData.statistics?.viewCount)}
              </p>
              <div className="text-sm text-gray-400 mt-2">
                Lifetime views across all videos
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Video Count</h3>
              <p className="text-3xl font-bold text-white mb-1">
                {formatCount(channelData.statistics?.videoCount)}
              </p>
              <div className="text-sm text-gray-400 mt-2">
                Total videos published on this channel
              </div>
            </div>
          </div>
          
          {/* Channel engagement analysis */}
          <div className="mb-8">
            <ChannelEngagementCard channelData={channelData} />
          </div>
          
          {/* Channel description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Channel Description</h3>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-300 whitespace-pre-wrap">
                {channelData.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          {/* Audience growth estimation */}
          {calculateGrowthEstimate(channelData) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Audience Growth Estimation</h3>
              <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Monthly Subscriber Growth</h4>
                    <p className="text-3xl font-bold text-white">
                      ~{formatCount(calculateGrowthEstimate(channelData).monthlySubscribers)}
                    </p>
                    <div className="text-sm text-gray-400 mt-2 text-center">
                      Based on channel's historical growth rate
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Monthly Views</h4>
                    <p className="text-3xl font-bold text-white">
                      ~{formatCount(calculateGrowthEstimate(channelData).monthlyViews)}
                    </p>
                    <div className="text-sm text-gray-400 mt-2 text-center">
                      Estimated based on historical average
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Upload Frequency</h4>
                    <p className="text-3xl font-bold text-white">
                      ~{formatCount(calculateGrowthEstimate(channelData).videosPerMonth)}/month
                    </p>
                    <div className="text-sm text-gray-400 mt-2 text-center">
                      Based on historical upload rate
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">Estimated Monthly Revenue</h4>
                  {calculateRevenueEstimate(channelData) && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-white">
                        <span className="font-bold text-green-400">
                          ${Math.round(calculateRevenueEstimate(channelData).minMonthlyRevenue).toLocaleString()} - 
                          ${Math.round(calculateRevenueEstimate(channelData).maxMonthlyRevenue).toLocaleString()}
                        </span> 
                        <span className="text-sm text-gray-400 ml-2">
                          (estimated based on ${calculateRevenueEstimate(channelData).minCpm.toFixed(2)} - 
                          ${calculateRevenueEstimate(channelData).maxCpm.toFixed(2)} CPM)
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        This is an estimate based on industry averages. Actual revenue varies based on niche, audience demographics, 
                        ad blockers usage, monetization status, and other factors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Recent videos section */}
          {channelData.recentVideos && channelData.recentVideos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Recent Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {channelData.recentVideos.map((video) => (
                  <div key={video.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative">
                        <img 
                          src={video.thumbnails?.medium?.url || video.thumbnails?.default?.url} 
                          alt={video.title || 'Video thumbnail'} 
                          className="w-full h-auto object-cover"
                        />
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>
                    </a>
                    
                    <div className="p-4">
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h4 className="text-white font-semibold mb-2 line-clamp-2 hover:text-red-500 transition-colors duration-200">
                          {video.title || 'Untitled video'}
                        </h4>
                      </a>
                      
                      <div className="flex justify-between text-sm text-gray-400 mb-3">
                        <span>{video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Unknown date'}</span>
                        <a 
                          href={`/video/${video.id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          Analyze
                        </a>
                      </div>
                      
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {formatCount(video.statistics?.viewCount || 0)}
                        </div>
                        
                        {video.statistics && video.statistics.likeCount && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {formatCount(video.statistics.likeCount)}
                          </div>
                        )}
                        
                        {video.statistics && video.statistics.commentCount && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            {formatCount(video.statistics.commentCount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg text-sm text-gray-400">
            <p>
              <strong>Disclaimer:</strong> All analytics and estimates are based on publicly available data from the YouTube API.
              Growth projections and revenue estimates are approximations based on historical data and industry averages.
              For the most accurate analytics, please refer to your YouTube Studio dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelAnalytics; 