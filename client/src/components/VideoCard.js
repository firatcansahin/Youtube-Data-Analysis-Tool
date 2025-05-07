import React from 'react';
import { formatStatistics } from '../utils/analyticsUtils';

const VideoCard = ({ videoData }) => {
  if (!videoData) return null;
  
  const getYoutubeUrl = (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };
  
  // Format statistics for better display
  const formattedStats = formatStatistics(videoData.statistics);

  return (
    <div className="bg-youtube-gray p-6 rounded-lg shadow-lg">
      <div className="relative">
        <img 
          src={videoData.thumbnails?.high?.url || videoData.thumbnails?.medium?.url} 
          alt={videoData.title} 
          className="w-full h-auto object-contain rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {videoData.duration}
        </div>
      </div>
      
      <h1 className="text-xl font-bold text-white mt-4 mb-2">{videoData.title}</h1>
      
      <div className="text-youtube-light-gray text-sm mb-4">
        Published on {new Date(videoData.publishedAt).toLocaleDateString()}
      </div>
      
      <div className="mb-4 bg-youtube-black bg-opacity-40 p-3 rounded-lg">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">{formattedStats.viewCount}</span>
            <span className="text-xs text-youtube-light-gray">Views</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-white mr-1">{formattedStats.likeCount}</span>
              <span className="text-xs text-green-400">({formattedStats.likeRatio}%)</span>
            </div>
            <span className="text-xs text-youtube-light-gray">Likes</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-white mr-1">{formattedStats.commentCount}</span>
              <span className="text-xs text-blue-400">({formattedStats.commentRatio}%)</span>
            </div>
            <span className="text-xs text-youtube-light-gray">Comments</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4 h-28 overflow-y-auto bg-youtube-black bg-opacity-30 p-3 rounded-lg">
        <p className="text-youtube-light-gray text-sm">{videoData.description}</p>
      </div>
      
      <div className="flex space-x-2">
        <a 
          href={getYoutubeUrl(videoData.id)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-youtube-red hover:bg-red-700 text-white py-2 px-4 rounded-lg text-center flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Watch on YouTube
        </a>
        <a 
          href={`https://studio.youtube.com/video/${videoData.id}/analytics/tab-overview/period-default`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-center flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          YouTube Studio Analytics
        </a>
      </div>
    </div>
  );
};

export default VideoCard; 