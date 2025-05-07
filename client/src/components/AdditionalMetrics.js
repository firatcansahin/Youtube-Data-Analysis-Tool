import React, { useState } from 'react';

const AdditionalMetrics = ({ videoData }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  if (!videoData) return null;
  
  const tooltips = {
    watchTime: "Total estimated time viewers have spent watching your video. Calculated based on views and estimated retention rate.",
    impressions: "Estimated number of times your video has been shown to viewers before they clicked. Important for understanding video reach.",
    ctr: "Click-Through-Rate represents the percentage of impressions that resulted in a view. High CTR indicates strong thumbnail and title.",
    retention: "Percentage of the video that is watched by the average viewer. Higher retention rates correlate with better content quality.",
    avgViewDuration: "Average length of time viewers spend watching your video. An important metric for YouTube's recommendation system.",
    shares: "Estimated number of times your video has been shared. High share counts indicate high-value or highly engaging content."
  };

  const handleTooltipToggle = (tooltip) => {
    setActiveTooltip(activeTooltip === tooltip ? null : tooltip);
  };

  return (
    <div className="bg-youtube-gray p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Hidden Metrics
        <span className="ml-2 text-xs text-gray-400 font-normal">(YouTube doesn't show these publicly)</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">Watch Time (est.)</h3>
            <button 
              onClick={() => handleTooltipToggle('watchTime')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateWatchTime(videoData)}
          </p>
          {activeTooltip === 'watchTime' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.watchTime}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">Impressions (est.)</h3>
            <button 
              onClick={() => handleTooltipToggle('impressions')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateImpressions(videoData)}
          </p>
          {activeTooltip === 'impressions' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.impressions}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">CTR (est.)</h3>
            <button 
              onClick={() => handleTooltipToggle('ctr')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateCTR(videoData)}%
          </p>
          {activeTooltip === 'ctr' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.ctr}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">Retention (est.)</h3>
            <button 
              onClick={() => handleTooltipToggle('retention')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateRetention(videoData)}%
          </p>
          {activeTooltip === 'retention' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.retention}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">Avg. View Duration</h3>
            <button 
              onClick={() => handleTooltipToggle('avgViewDuration')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateAvgViewDuration(videoData)}
          </p>
          {activeTooltip === 'avgViewDuration' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.avgViewDuration}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 rounded-lg relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-youtube-light-gray mb-1">Shares (est.)</h3>
            <button 
              onClick={() => handleTooltipToggle('shares')}
              className="text-blue-400 text-xs hover:text-blue-300 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-lg font-semibold text-white">
            {estimateShares(videoData)}
          </p>
          {activeTooltip === 'shares' && (
            <div className="absolute left-0 right-0 -bottom-20 bg-gray-900 p-2 rounded-md text-xs text-white z-10 shadow-lg">
              {tooltips.shares}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        * These metrics are estimates based on industry averages and video performance
      </div>
    </div>
  );
};

// Helper functions to estimate metrics not provided by the YouTube API

// Estimate total watch time based on views and video duration
const estimateWatchTime = (videoData) => {
  try {
    const views = parseInt(videoData.statistics.viewCount) || 0;
    const duration = videoData.duration || 'PT0M0S';
    
    // Parse ISO 8601 duration
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]?.replace('H', '') || 0);
    const minutes = parseInt(match[2]?.replace('M', '') || 0);
    const seconds = parseInt(match[3]?.replace('S', '') || 0);
    
    // Calculate duration in seconds
    const durationInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Assume average viewer watches 50% of the video
    const avgRetentionRate = 0.5;
    const totalWatchTimeInSeconds = views * durationInSeconds * avgRetentionRate;
    
    // Format the watch time
    if (totalWatchTimeInSeconds > 3600) {
      const watchTimeInHours = Math.round(totalWatchTimeInSeconds / 3600);
      return `${watchTimeInHours} hours`;
    } else if (totalWatchTimeInSeconds > 60) {
      const watchTimeInMinutes = Math.round(totalWatchTimeInSeconds / 60);
      return `${watchTimeInMinutes} minutes`;
    } else {
      return `${Math.round(totalWatchTimeInSeconds)} seconds`;
    }
  } catch (error) {
    return 'N/A';
  }
};

// Estimate impressions based on views and average CTR
const estimateImpressions = (videoData) => {
  try {
    const views = parseInt(videoData.statistics.viewCount) || 0;
    const estimatedCTR = estimateCTR(videoData) / 100;
    
    const impressions = Math.round(views / estimatedCTR);
    
    // Format with thousands separator
    return impressions.toLocaleString();
  } catch (error) {
    return 'N/A';
  }
};

// Estimate click-through rate based on engagement
const estimateCTR = (videoData) => {
  try {
    const engagementRate = parseFloat(videoData.engagementRate) || 0;
    
    // CTR generally correlates with engagement rate but is typically higher
    // Use a baseline of 4% with adjustments based on engagement
    let baseCTR = 4;
    
    if (engagementRate > 10) {
      baseCTR = 10;
    } else if (engagementRate > 7) {
      baseCTR = 8;
    } else if (engagementRate > 5) {
      baseCTR = 6;
    } else if (engagementRate > 3) {
      baseCTR = 5;
    } else if (engagementRate < 1) {
      baseCTR = 3;
    }
    
    return baseCTR.toFixed(1);
  } catch (error) {
    return '4.0';
  }
};

// Estimate retention rate based on engagement
const estimateRetention = (videoData) => {
  try {
    const engagementRate = parseFloat(videoData.engagementRate) || 0;
    const likes = parseInt(videoData.statistics.likeCount) || 0;
    const views = parseInt(videoData.statistics.viewCount) || 0;
    
    // Retention correlates with engagement but falls off more quickly
    // Base retention around 40-60% depending on engagement metrics
    let baseRetention = 40;
    
    if (engagementRate > 10) {
      baseRetention = 65;
    } else if (engagementRate > 7) {
      baseRetention = 60;
    } else if (engagementRate > 5) {
      baseRetention = 55;
    } else if (engagementRate > 3) {
      baseRetention = 50;
    } else if (engagementRate > 1) {
      baseRetention = 45;
    }
    
    // Adjust based on like ratio
    const likeRatio = (likes / views) * 100;
    if (likeRatio > 5) baseRetention += 5;
    if (likeRatio > 10) baseRetention += 5;
    
    return baseRetention.toFixed(1);
  } catch (error) {
    return '45.0';
  }
};

// Estimate average view duration
const estimateAvgViewDuration = (videoData) => {
  try {
    const duration = videoData.duration || 'PT0M0S';
    const retention = estimateRetention(videoData);
    
    // Parse ISO 8601 duration
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]?.replace('H', '') || 0);
    const minutes = parseInt(match[2]?.replace('M', '') || 0);
    const seconds = parseInt(match[3]?.replace('S', '') || 0);
    
    // Calculate duration in seconds
    const durationInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Calculate average view duration
    const avgDurationInSeconds = durationInSeconds * (retention / 100);
    
    // Format the duration
    const avgMinutes = Math.floor(avgDurationInSeconds / 60);
    const avgSeconds = Math.round(avgDurationInSeconds % 60);
    
    return `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;
  } catch (error) {
    return 'N/A';
  }
};

// Estimate shares based on views and engagement
const estimateShares = (videoData) => {
  try {
    const views = parseInt(videoData.statistics.viewCount) || 0;
    const engagementRate = parseFloat(videoData.engagementRate) || 0;
    
    // Shares are typically around 1% of views for average content
    // But scale with engagement rate
    let shareRate = 0.01;
    
    if (engagementRate > 10) {
      shareRate = 0.03;
    } else if (engagementRate > 7) {
      shareRate = 0.025;
    } else if (engagementRate > 5) {
      shareRate = 0.02;
    } else if (engagementRate > 3) {
      shareRate = 0.015;
    } else if (engagementRate < 1) {
      shareRate = 0.005;
    }
    
    const shares = Math.round(views * shareRate);
    
    // Format with thousands separator
    return shares.toLocaleString();
  } catch (error) {
    return 'N/A';
  }
};

export default AdditionalMetrics; 