const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // for vercel
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// YouTube API Key
const API_KEY = process.env.YOUTUBE_API_KEY;

// Route to get video statistics
app.get('/api/video', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log(`Fetching video data for ID: ${videoId}`);

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = response.data.items[0];
    const engagementRate = calculateEngagementRate(videoData.statistics);

    res.json({
      id: videoData.id,
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      publishedAt: videoData.snippet.publishedAt,
      channelId: videoData.snippet.channelId,
      channelTitle: videoData.snippet.channelTitle,
      duration: videoData.contentDetails.duration,
      thumbnails: videoData.snippet.thumbnails,
      statistics: videoData.statistics,
      engagementRate
    });
  } catch (error) {
    console.error('Error fetching video data:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data. Please check your API key and try again.' });
  }
});

// Route to get channel statistics
app.get('/api/channel', async (req, res) => {
  try {
    const { channelId } = req.query;
    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    console.log(`Fetching channel data for ID: ${channelId}`);

    let finalChannelId = channelId;
    
    // Check if this is a custom URL or username (@handle) rather than a channel ID
    if (!channelId.startsWith('UC') || channelId.length !== 24) {
      // For custom URLs or usernames, we need to resolve them to channel IDs first
      try {
        // Try to resolve with search first (works for handles and custom URLs)
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: channelId,
            type: 'channel',
            maxResults: 1,
            key: API_KEY
          }
        });
        
        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          finalChannelId = searchResponse.data.items[0].snippet.channelId;
          console.log(`Resolved channel ID from search: ${finalChannelId}`);
        } else {
          return res.status(404).json({ error: 'Channel not found' });
        }
      } catch (err) {
        console.error('Error resolving channel ID from custom name:', err.message);
        return res.status(500).json({ error: 'Failed to resolve channel ID from custom name' });
      }
    }

    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics,brandingSettings',
        id: finalChannelId,
        key: API_KEY
      }
    });

    if (channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channelData = channelResponse.data.items[0];

    // Get recent videos from the channel
    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: finalChannelId,
        maxResults: 10,
        order: 'date',
        type: 'video',
        key: API_KEY
      }
    });

    const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');
    
    // Get detailed stats for these videos
    const videoStatsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics',
        id: videoIds,
        key: API_KEY
      }
    });

    const videoStats = videoStatsResponse.data.items;
    const avgEngagement = calculateAverageEngagement(videoStats);

    res.json({
      id: channelData.id,
      title: channelData.snippet.title,
      description: channelData.snippet.description,
      publishedAt: channelData.snippet.publishedAt,
      country: channelData.snippet.country,
      thumbnails: channelData.snippet.thumbnails,
      statistics: channelData.statistics,
      avgEngagement,
      recentVideos: videosResponse.data.items.map((item, index) => {
        const stats = videoStats.find(v => v.id === item.id.videoId)?.statistics || {};
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          thumbnails: item.snippet.thumbnails,
          statistics: stats
        };
      })
    });
  } catch (error) {
    console.error('Error fetching channel data:', error.message);
    res.status(500).json({ error: 'Failed to fetch channel data. Please check your API key and try again.' });
  }
});

// Helper function to calculate engagement rate
function calculateEngagementRate(statistics) {
  const views = parseInt(statistics.viewCount) || 0;
  const likes = parseInt(statistics.likeCount) || 0;
  const comments = parseInt(statistics.commentCount) || 0;
  
  if (views === 0) return 0;
  
  // Engagement rate = (likes + comments) / views * 100
  return ((likes + comments) / views * 100).toFixed(2);
}

// Helper function to calculate average engagement across videos
function calculateAverageEngagement(videos) {
  if (!videos || videos.length === 0) return 0;
  
  let totalEngagement = 0;
  
  videos.forEach(video => {
    const stats = video.statistics;
    const engagement = calculateEngagementRate(stats);
    totalEngagement += parseFloat(engagement);
  });
  
  return (totalEngagement / videos.length).toFixed(2);
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
