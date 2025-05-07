import React from 'react';

const About = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        About YouTube Analytics
      </h1>

      <div className="bg-youtube-gray p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
        <p className="text-gray-300 mb-6">
          YouTube Analytics provides content creators, marketers, and YouTube enthusiasts with deep insights into video and channel performance. Our mission is to help you understand your audience better and make data-driven decisions to improve your content strategy.
        </p>
        
        <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
        <p className="text-gray-300 mb-6">
          Our platform uses the YouTube Data API to fetch comprehensive statistics about videos and channels. We calculate engagement metrics that aren't readily available through YouTube's standard interface, giving you a competitive advantage in understanding performance.
        </p>
        
        <h2 className="text-2xl font-semibold text-white mb-4">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Video Analytics</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>View counts and engagement statistics</li>
              <li>Like-to-view and comment-to-view ratios</li>
              <li>Overall engagement rate calculation</li>
              <li>Video metadata and publishing details</li>
              <li>Visual representation of performance metrics</li>
            </ul>
          </div>
          
          <div className="border border-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Channel Analytics</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Subscriber count and growth metrics</li>
              <li>Total view counts across all videos</li>
              <li>Channel engagement rates</li>
              <li>Recent video performance</li>
              <li>Channel growth and publishing trends</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-youtube-gray p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Is this service free to use?</h3>
            <p className="text-gray-300">
              Yes, our basic analytics service is completely free to use. We may introduce premium features in the future, but our core functionality will always remain free.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Do you store any of my data?</h3>
            <p className="text-gray-300">
              We don't store any personal data. The analysis is performed in real-time using the YouTube API, and results are displayed directly to you without being saved on our servers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">How accurate are the analytics?</h3>
            <p className="text-gray-300">
              Our analytics are based on official YouTube API data, so they're as accurate as the data YouTube provides. Engagement rate calculations use standard industry formulas.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Can I analyze any YouTube video or channel?</h3>
            <p className="text-gray-300">
              Yes, you can analyze any public video or channel on YouTube. Private or unlisted videos cannot be analyzed as they're not accessible through the YouTube API.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">How is the engagement rate calculated?</h3>
            <p className="text-gray-300">
              We calculate engagement rate as (likes + comments) / views × 100. This gives a percentage that represents how engaged viewers are with the content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 