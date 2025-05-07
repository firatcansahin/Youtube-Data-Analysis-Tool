import React from 'react';
import { calculateChannelEngagementRate } from '../utils/analyticsUtils';

const ChannelEngagementCard = ({ channelData }) => {
  if (!channelData) return null;
  
  const { engagementRate, evaluation, details } = calculateChannelEngagementRate(channelData);
  
  // Get the appropriate icon based on evaluation
  const getIcon = () => {
    switch (evaluation.icon) {
      case 'trophy':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        );
      case 'thumbs-up':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'hand':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
          </svg>
        );
      case 'exclamation':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'x-circle':
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Get tips based on engagement level
  const getTips = () => {
    switch (evaluation.status) {
      case 'Excellent':
        return [
          "Analyze your most successful content to understand what resonates",
          "Maintain your current posting schedule and engagement style",
          "Consider creating premium content or memberships for dedicated fans",
          "Expand your channel with collaborations to reach new audiences"
        ];
      case 'Very Good':
        return [
          "Focus on your most engaged video formats and topics",
          "Increase upload frequency if possible to capitalize on engagement",
          "Encourage more community participation through comments and polls",
          "Try creating series content to keep viewers coming back"
        ];
      case 'Good':
        return [
          "Improve your call-to-actions to boost engagement",
          "Experiment with different video formats and styles",
          "Analyze your audience demographics to target content better",
          "Put more emphasis on video intros to hook viewers immediately"
        ];
      case 'Average':
        return [
          "Improve your content quality and production value",
          "Focus on creating more compelling thumbnails and titles",
          "Ask viewers direct questions to encourage comments",
          "Consider experimenting with different content niches"
        ];
      case 'Below Average':
        return [
          "Revisit your content strategy and target audience",
          "Improve video quality, lighting, and audio",
          "Study successful channels in your niche",
          "Consider revamping your channel branding and presentation"
        ];
      case 'Poor':
        return [
          "Completely rethink your content strategy",
          "Focus on building a specific niche audience",
          "Invest in better equipment if budget allows",
          "Study YouTube SEO best practices and implementation"
        ];
      default:
        return [
          "Focus on creating quality content that resonates with your audience",
          "Engage with your viewers through comments and community posts",
          "Optimize your titles, descriptions, and tags for better discoverability"
        ];
    }
  };
  
  // Calculate percentage for progress bar (capped at 100%)
  const progressPercentage = Math.min(parseFloat(engagementRate) * 10, 100);
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Channel Engagement Analysis</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className={`text-${evaluation.color} flex-shrink-0`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-white">{engagementRate}%</p>
            <p className={`text-${evaluation.color} font-medium`}>{evaluation.status}</p>
          </div>
          
          <p className="text-gray-400 text-sm">{evaluation.message}</p>
          
          {/* Progress bar with label */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Engagement Scale</span>
              <span>{progressPercentage.toFixed(1)}% (10% is excellent)</span>
            </div>
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden relative">
              <div 
                className={`bg-${evaluation.color} h-full rounded-full transition-all duration-500 ease-out`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
              
              {/* Ticks for engagement scale */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-2 pointer-events-none">
                <div className="h-3 w-px bg-gray-500 opacity-50"></div>
                <div className="h-3 w-px bg-gray-500 opacity-50"></div>
                <div className="h-3 w-px bg-gray-500 opacity-50"></div>
                <div className="h-3 w-px bg-gray-500 opacity-50"></div>
                <div className="h-3 w-px bg-gray-500 opacity-50"></div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Poor</span>
              <span>Below Avg</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </div>
      
      {details && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
            <p className="text-gray-400 text-xs mb-1">Average Views per Video</p>
            <p className="text-white font-medium">{details.viewsPerVideo.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
            <p className="text-gray-400 text-xs mb-1">Subscriber View Ratio</p>
            <p className="text-white font-medium">{details.subscriberViewRatio}%</p>
          </div>
          
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
            <p className="text-gray-400 text-xs mb-1">Est. Watch Time per Video</p>
            <p className="text-white font-medium">{details.estimatedAvgWatchTime} hours</p>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h4 className="text-white text-sm font-medium mb-3">Recommendations</h4>
        <ul className="list-disc pl-5 space-y-2">
          {getTips().map((tip, index) => (
            <li key={index} className="text-gray-400 text-sm">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChannelEngagementCard; 