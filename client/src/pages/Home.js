import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          YouTube Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Analyze YouTube videos and channels to get detailed insights on performance, engagement rates, and audience metrics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/video-analytics" className="bg-youtube-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            Analyze Video
          </Link>
          <Link to="/channel-analytics" className="bg-youtube-gray hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg border border-youtube-red transition-colors duration-300">
            Analyze Channel
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 my-12">
        <div className="bg-youtube-gray p-6 rounded-lg">
          <div className="text-youtube-red text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
          <p className="text-gray-300">
            Get up-to-date metrics for any YouTube video or channel. See view counts, engagement rates, and more in real-time.
          </p>
        </div>

        <div className="bg-youtube-gray p-6 rounded-lg">
          <div className="text-youtube-red text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Engagement Metrics</h3>
          <p className="text-gray-300">
            Understand how viewers interact with content through likes, comments, shares, and custom engagement rate calculations.
          </p>
        </div>

        <div className="bg-youtube-gray p-6 rounded-lg">
          <div className="text-youtube-red text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Visual Reports</h3>
          <p className="text-gray-300">
            View beautiful charts and visualizations that make it easy to understand performance at a glance.
          </p>
        </div>
      </section>

      <section className="my-16 bg-youtube-gray p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-youtube-red rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-white font-bold mb-2">Enter YouTube URL</h3>
            <p className="text-gray-300">Paste the URL of any YouTube video or channel you want to analyze.</p>
          </div>
          <div className="text-center">
            <div className="bg-youtube-red rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-white font-bold mb-2">Process Data</h3>
            <p className="text-gray-300">Our system fetches all available analytics data through the YouTube API.</p>
          </div>
          <div className="text-center">
            <div className="bg-youtube-red rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-white font-bold mb-2">View Insights</h3>
            <p className="text-gray-300">Get comprehensive analytics displayed in an easy-to-understand dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 