import React from 'react';
import { evaluateEngagementRate, getAdditionalMetrics } from '../utils/analyticsUtils';

const EngagementRating = ({ videoData }) => {
  if (!videoData || !videoData.statistics) return null;
  
  // Calculate engagement rate (likes + comments) / views * 100
  const views = parseInt(videoData.statistics.viewCount) || 0;
  const likes = parseInt(videoData.statistics.likeCount) || 0;
  const comments = parseInt(videoData.statistics.commentCount) || 0;
  
  if (views === 0) return null;
  
  const engagementRate = ((likes + comments) / views) * 100;
  videoData.engagementRate = engagementRate.toFixed(2);
  
  const evaluation = evaluateEngagementRate(engagementRate);
  
  // Get the appropriate icon based on evaluation icon name
  const getIcon = () => {
    switch (evaluation.icon) {
      case 'trophy':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        );
      case 'thumbs-up':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'hand':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
          </svg>
        );
      case 'exclamation':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'x-circle':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Generate suggestions based on evaluation
  const getSuggestions = () => {
    switch (evaluation.status) {
      case 'Excellent':
        return [
          "Continue with your current content strategy",
          "Consider creating premium content or membership options",
          "Expand on similar content themes that engage viewers"
        ];
      case 'Very Good':
        return [
          "Analyze what aspects of this video are working well",
          "Create more content with similar themes or format",
          "Engage more with your audience in comments"
        ];
      case 'Good':
        return [
          "Add more interactive elements like polls or questions",
          "Improve your call-to-actions in the video",
          "Respond to more viewer comments to boost engagement"
        ];
      case 'Average':
        return [
          "Improve your thumbnail and title for better click-through",
          "Add questions throughout the video to encourage comments",
          "Consider revising your content format for more engagement"
        ];
      case 'Below Average':
        return [
          "Revise your content strategy for this type of video",
          "Improve production quality and pacing",
          "Study similar videos with higher engagement"
        ];
      case 'Poor':
        return [
          "Reconsider your content approach for this topic",
          "Analyze audience retention to identify drop-off points",
          "Study successful videos in your niche for improvement ideas"
        ];
      default:
        return [
          "Review your content strategy",
          "Engage more with your audience",
          "Study similar successful videos"
        ];
    }
  };
  
  const additionalMetrics = getAdditionalMetrics(videoData);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold text-white mb-4">Engagement Analysis</h3>
      
      <div className="flex items-center gap-6 mb-6">
        <div className={`text-${evaluation.color} flex-shrink-0`}>
          {getIcon()}
        </div>
        
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-white">{engagementRate.toFixed(2)}%</p>
            <p className={`text-${evaluation.color} font-medium`}>{evaluation.status}</p>
          </div>
          
          <p className="text-gray-400">
            {evaluation.message}
          </p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="text-lg font-semibold text-white mb-3">Recommendations</h4>
        <ul className="list-disc pl-5 space-y-2">
          {getSuggestions().map((suggestion, index) => (
            <li key={index} className="text-gray-400">{suggestion}</li>
          ))}
        </ul>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-youtube-black bg-opacity-30 p-3 rounded-lg">
          <h3 className="text-white text-sm font-semibold mb-1">Likes/Views Ratio</h3>
          <p className="text-youtube-red font-bold">{additionalMetrics.likesToViewsRatio}%</p>
        </div>
        
        <div className="bg-youtube-black bg-opacity-30 p-3 rounded-lg">
          <h3 className="text-white text-sm font-semibold mb-1">Comments/Views Ratio</h3>
          <p className="text-youtube-red font-bold">{additionalMetrics.commentsToViewsRatio}%</p>
        </div>
        
        <div className="bg-youtube-black bg-opacity-30 p-3 rounded-lg">
          <h3 className="text-white text-sm font-semibold mb-1">Daily Views</h3>
          <p className="text-youtube-red font-bold">{additionalMetrics.viewsPerDay}</p>
        </div>
        
        <div className="bg-youtube-black bg-opacity-30 p-3 rounded-lg">
          <h3 className="text-white text-sm font-semibold mb-1">Daily Engagement</h3>
          <p className="text-youtube-red font-bold">{additionalMetrics.likesPerDay + additionalMetrics.commentsPerDay}</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementRating; 