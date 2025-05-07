import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import VideoCard from '../components/VideoCard';
import EngagementRating from '../components/EngagementRating';
import RevenueEstimation from '../components/RevenueEstimation';
import AdditionalMetrics from '../components/AdditionalMetrics';
import PdfExportButton from '../components/PdfExportButton';
import ExcelExportButton from '../components/ExcelExportButton';
import RefreshDataButton from '../components/RefreshDataButton';
import HistoryList from '../components/HistoryList';

const VideoAnalytics = () => {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { resultId } = useParams();

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing search history', e);
        localStorage.removeItem('searchHistory');
      }
    }
  }, []);

  // If resultId is provided, try to fetch from history or API
  useEffect(() => {
    if (resultId) {
      // First check if it's in the history
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          const historyItem = history.find(item => item.resultId === resultId);
          
          if (historyItem && historyItem.videoId) {
            fetchVideoData(historyItem.videoId, false);
          }
        } catch (e) {
          console.error('Error finding history item', e);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId]);

  // Extract video ID from YouTube URL - update this function to handle more YouTube URL formats
  const extractVideoId = (url) => {
    // Remove any query parameters after the video ID
    const cleanUrl = url.split('&')[0];
    
    // Handle youtu.be format
    if (cleanUrl.includes('youtu.be/')) {
      const parts = cleanUrl.split('youtu.be/');
      if (parts[1]) {
        const idPart = parts[1].split('?')[0].split('/')[0];
        return idPart.length === 11 ? idPart : null;
      }
      return null;
    }
    
    // Handle youtube.com format with v parameter
    if (cleanUrl.includes('youtube.com/watch')) {
      const match = cleanUrl.match(/v=([^&]+)/);
      return (match && match[1].length === 11) ? match[1] : null;
    }
    
    // Handle youtube.com/embed format
    if (cleanUrl.includes('youtube.com/embed/')) {
      const parts = cleanUrl.split('youtube.com/embed/');
      if (parts[1]) {
        const idPart = parts[1].split('?')[0].split('/')[0];
        return idPart.length === 11 ? idPart : null;
      }
      return null;
    }
    
    // Handle direct video ID input (11 characters)
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  };

  // Fetch video data from API
  const fetchVideoData = async (videoId, saveToHistory = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/video?videoId=${videoId}`);
      const data = response.data;
      setVideoData(data);
      
      // Generate a unique result ID and navigate to it
      if (saveToHistory) {
        const uniqueId = uuidv4().slice(0, 8);
        
        // Save to search history
        const newHistoryItem = {
          id: uuidv4(),
          resultId: uniqueId,
          videoId: videoId,
          title: data.title,
          thumbnail: data.thumbnails?.medium?.url || '',
          timestamp: new Date().toISOString(),
          searchType: 'Video'
        };
        
        // Add to history and save to localStorage
        const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10); // Keep only 10 most recent
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        
        // Navigate to the unique URL
        navigate(`/video/${uniqueId}`);
      }
      
    } catch (err) {
      console.error('Error fetching video data:', err);
      setError(err.response?.data?.error || 'Failed to fetch video data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid URL.');
      return;
    }
    
    fetchVideoData(videoId);
  };

  // Refresh video data
  const handleRefresh = (videoId) => {
    fetchVideoData(videoId, false);
  };

  // Clear search history
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Toggle history view
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-white mb-6">YouTube Video Analytics</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="flex-1 py-2 px-4 rounded-lg bg-youtube-black text-white border border-gray-700 focus:outline-none focus:border-youtube-red"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-youtube-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Video'
            )}
          </button>
          <button
            type="button"
            onClick={toggleHistory}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 bg-red-900 bg-opacity-50 text-white p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {/* Search History */}
      {showHistory && (
        <HistoryList 
          searchHistory={searchHistory}
          onClearHistory={handleClearHistory}
        />
      )}

      {videoData && (
        <>
          <div className="mb-4 flex flex-wrap gap-2 justify-end">
            <RefreshDataButton 
              videoId={videoData.id}
              onRefresh={handleRefresh}
              isLoading={loading}
            />
            <PdfExportButton 
              videoData={videoData}
              elementId="video-analysis-content"
            />
            <ExcelExportButton 
              videoData={videoData}
            />
          </div>
          
          <div id="video-analysis-content" ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VideoCard videoData={videoData} />
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <EngagementRating videoData={videoData} />
              </div>
              
              <div>
                <RevenueEstimation videoData={videoData} />
              </div>
              
              <div>
                <AdditionalMetrics videoData={videoData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoAnalytics; 