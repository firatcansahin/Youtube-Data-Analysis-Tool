import React from 'react';
import { estimateVideoRevenue } from '../utils/analyticsUtils';

const RevenueEstimation = ({ videoData }) => {
  const revenue = estimateVideoRevenue(videoData);

  return (
    <div className="bg-youtube-gray p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Revenue Estimation
      </h2>
      
      <div className="mb-6 text-center">
        <div className="text-4xl font-bold text-green-500 mb-2">${revenue.estimated}</div>
        <p className="text-youtube-light-gray text-sm">Estimated Total Revenue</p>
        <p className="text-xs text-gray-400 mt-1">Range: ${revenue.range.min} - ${revenue.range.max}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg">
          <div className="text-xl font-bold text-green-400">${revenue.monthly}</div>
          <p className="text-youtube-light-gray text-sm">Estimated Monthly</p>
        </div>
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
          <div className="text-xl font-bold text-blue-400">${revenue.cpmRange.min} - ${revenue.cpmRange.max}</div>
          <p className="text-youtube-light-gray text-sm">Estimated CPM</p>
        </div>
      </div>
      
      <div className="text-gray-400 text-xs border-t border-gray-700 pt-4">
        <p className="mb-1">* Estimations are based on industry averages</p>
        <p className="mb-1">* Assumes 60% of views are monetized</p>
        <p>* Actual revenue may vary based on audience demographics, seasonality, and advertiser demand</p>
      </div>
    </div>
  );
};

export default RevenueEstimation; 