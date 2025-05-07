/**
 * Utility functions for video and channel analytics
 */

/**
 * Evaluates engagement rate and returns evaluation information
 * @param {number} rate - Engagement rate as percentage
 * @returns {Object} - Evaluation object with status, message and color
 */
export const evaluateEngagementRate = (rate) => {
  const engagementRate = parseFloat(rate);
  
  if (engagementRate >= 10) {
    return {
      status: 'Excellent',
      message: 'Far above average engagement. Your content is resonating extremely well with viewers.',
      color: 'green-600',
      icon: 'trophy'
    };
  } else if (engagementRate >= 7) {
    return {
      status: 'Very Good',
      message: 'Strong engagement. Your content is performing well above average.',
      color: 'green-500',
      icon: 'thumbs-up'
    };
  } else if (engagementRate >= 4) {
    return {
      status: 'Good',
      message: 'Above average engagement. Your content is connecting with your audience.',
      color: 'green-400',
      icon: 'check-circle'
    };
  } else if (engagementRate >= 2) {
    return {
      status: 'Average',
      message: 'Average engagement for YouTube. Consider testing new approaches to boost engagement.',
      color: 'yellow-500',
      icon: 'hand'
    };
  } else if (engagementRate >= 1) {
    return {
      status: 'Below Average',
      message: 'Engagement is below average. Review your content strategy and audience targeting.',
      color: 'orange-500',
      icon: 'exclamation'
    };
  } else {
    return {
      status: 'Poor',
      message: 'Low engagement. Significant improvements needed in content and audience engagement.',
      color: 'red-500',
      icon: 'x-circle'
    };
  }
};

/**
 * Estimates video revenue based on views, engagement and other factors
 * @param {Object} videoData - Video data including statistics
 * @returns {Object} - Revenue estimation data
 */
export const estimateVideoRevenue = (videoData) => {
  if (!videoData || !videoData.statistics) {
    return {
      estimated: '0',
      range: { min: '0', max: '0' },
      monthly: '0',
      cpmRange: { min: '0', max: '0' }
    };
  }
  
  const views = parseInt(videoData.statistics.viewCount) || 0;
  const likes = parseInt(videoData.statistics.likeCount) || 0;
  const comments = parseInt(videoData.statistics.commentCount) || 0;
  
  // Calculate engagement rate
  const engagementRate = ((likes + comments) / views) * 100 || 0;
  
  // YouTube parameters - more accurate CPM rates based on industry research
  // Base rates vary by content category, region, and audience demographics
  let baseCpmMin = 1.0;
  let baseCpmMax = 3.0;
  
  // Adjust CPM based on engagement rate - highly engaged audiences bring higher ad rates
  if (engagementRate >= 10) {
    baseCpmMin = 6.0;
    baseCpmMax = 10.0;
  } else if (engagementRate >= 7) {
    baseCpmMin = 4.5;
    baseCpmMax = 7.5;
  } else if (engagementRate >= 4) {
    baseCpmMin = 3.0;
    baseCpmMax = 5.5;
  } else if (engagementRate >= 2) {
    baseCpmMin = 2.0;
    baseCpmMax = 4.0;
  } else if (engagementRate >= 1) {
    baseCpmMin = 1.5;
    baseCpmMax = 3.5;
  }
  
  // YouTube's actual monetization parameters
  // - YouTube takes 45% of ad revenue
  // - Only about 40-70% of views are monetized (ad blockers, non-monetizable content, etc.)
  // - Using 55% as the average monetizable view percentage
  const monetizableViews = views * 0.55;
  
  // Calculate revenue based on YouTube's revenue share model
  const revenueMin = (monetizableViews / 1000) * baseCpmMin * 0.55;
  const revenueMax = (monetizableViews / 1000) * baseCpmMax * 0.55;
  
  // Calculate per month based on video age and performance
  const publishDate = new Date(videoData.publishedAt);
  const now = new Date();
  const ageInDays = Math.max(1, Math.floor((now - publishDate) / (1000 * 60 * 60 * 24)));
  
  // Recent videos get higher view counts, older videos stabilize
  // Adjust for the "viral decay" factor where views drop over time
  let decayFactor = 1.0;
  if (ageInDays <= 7) {
    // First week has highest view velocity
    decayFactor = 1.2;
  } else if (ageInDays <= 30) {
    // First month still has good momentum
    decayFactor = 1.0;
  } else if (ageInDays <= 90) {
    // 1-3 months shows decline
    decayFactor = 0.8;
  } else {
    // Older videos have stabilized view rates
    decayFactor = 0.6;
  }
  
  const viewsPerDay = (views / ageInDays) * decayFactor;
  const monthlyViews = viewsPerDay * 30;
  const monthlyRevenue = (monthlyViews * 0.55 / 1000) * ((baseCpmMin + baseCpmMax) / 2) * 0.55;
  
  return {
    estimated: ((revenueMin + revenueMax) / 2).toFixed(2),
    range: {
      min: revenueMin.toFixed(2),
      max: revenueMax.toFixed(2)
    },
    monthly: monthlyRevenue.toFixed(2),
    cpmRange: {
      min: baseCpmMin.toFixed(2),
      max: baseCpmMax.toFixed(2)
    }
  };
};

/**
 * Returns additional engagement metrics that YouTube doesn't display
 * @param {Object} videoData - Video data including statistics
 * @returns {Object} - Additional metrics
 */
export const getAdditionalMetrics = (videoData) => {
  if (!videoData || !videoData.statistics) {
    return {};
  }
  
  const views = parseInt(videoData.statistics.viewCount) || 0;
  const likes = parseInt(videoData.statistics.likeCount) || 0;
  const comments = parseInt(videoData.statistics.commentCount) || 0;
  
  // Calculate various ratios
  const likesToViewsRatio = views > 0 ? (likes / views) * 100 : 0;
  const commentsToViewsRatio = views > 0 ? (comments / views) * 100 : 0;
  const commentsToLikesRatio = likes > 0 ? (comments / likes) * 100 : 0;
  
  // Calculate video age in days
  const publishDate = new Date(videoData.publishedAt);
  const now = new Date();
  const ageInDays = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));
  
  // Calculate daily metrics
  const viewsPerDay = ageInDays > 0 ? views / ageInDays : views;
  const likesPerDay = ageInDays > 0 ? likes / ageInDays : likes;
  const commentsPerDay = ageInDays > 0 ? comments / ageInDays : comments;
  
  return {
    likesToViewsRatio: likesToViewsRatio.toFixed(2),
    commentsToViewsRatio: commentsToViewsRatio.toFixed(2),
    commentsToLikesRatio: commentsToLikesRatio.toFixed(2),
    ageInDays,
    viewsPerDay: Math.round(viewsPerDay),
    likesPerDay: Math.round(likesPerDay),
    commentsPerDay: Math.round(commentsPerDay)
  };
};

/**
 * Format statistics for better display
 * @param {Object} statistics - Video statistics
 * @returns {Object} - Formatted statistics
 */
export const formatStatistics = (statistics) => {
  if (!statistics) return {};
  
  // Format view count
  const formatNumber = (num) => {
    const numInt = parseInt(num) || 0;
    if (numInt >= 1000000) {
      return (numInt / 1000000).toFixed(1) + 'M';
    } else if (numInt >= 1000) {
      return (numInt / 1000).toFixed(1) + 'K';
    } else {
      return numInt.toString();
    }
  };
  
  // Calculate ratios
  const viewCount = parseInt(statistics.viewCount) || 0;
  const likeCount = parseInt(statistics.likeCount) || 0;
  const commentCount = parseInt(statistics.commentCount) || 0;
  
  // Like ratio = likes per 100 views
  const likeRatio = viewCount > 0 ? (likeCount / viewCount * 100).toFixed(1) : 0;
  
  // Comment ratio = comments per 100 views
  const commentRatio = viewCount > 0 ? (commentCount / viewCount * 100).toFixed(1) : 0;
  
  return {
    viewCount: formatNumber(statistics.viewCount),
    likeCount: formatNumber(statistics.likeCount),
    commentCount: formatNumber(statistics.commentCount),
    viewCountRaw: viewCount,
    likeCountRaw: likeCount,
    commentCountRaw: commentCount,
    likeRatio,
    commentRatio
  };
};

/**
 * Calculate channel engagement rate
 * @param {Object} channelData - Channel data including statistics
 * @returns {Object} - Engagement rate and evaluation
 */
export const calculateChannelEngagementRate = (channelData) => {
  if (!channelData || !channelData.statistics) return { 
    engagementRate: 0, 
    evaluation: evaluateEngagementRate(0),
    details: null
  };
  
  const { viewCount, subscriberCount, videoCount } = channelData.statistics;
  
  if (!viewCount || !subscriberCount || !videoCount) return { 
    engagementRate: 0, 
    evaluation: evaluateEngagementRate(0),
    details: null
  };
  
  // Number of views per video
  const viewsPerVideo = parseInt(viewCount) / parseInt(videoCount);
  
  // Subscriber to view ratio (what % of subscribers watch each video on average)
  // A higher percentage means more subscribers watch each video
  const subscriberViewRatio = (viewsPerVideo / parseInt(subscriberCount)) * 100;
  
  // Calculate engagement rate based on subscriber to view ratio
  let engagementRate = 0;
  
  if (subscriberViewRatio >= 20) {
    // Extremely high engagement - more than 20% of subscribers watch each video
    engagementRate = 10 + (subscriberViewRatio - 20) / 8;  // Can go above 10%
  } else if (subscriberViewRatio >= 15) {
    // Very high engagement - 15-20% of subscribers watch each video
    engagementRate = 7 + (subscriberViewRatio - 15) / 2;
  } else if (subscriberViewRatio >= 8) {
    // Good engagement - 8-15% of subscribers watch each video
    engagementRate = 4 + (subscriberViewRatio - 8) / 2.33;
  } else if (subscriberViewRatio >= 3) {
    // Average engagement - 3-8% of subscribers watch each video
    engagementRate = 2 + (subscriberViewRatio - 3) / 5;
  } else if (subscriberViewRatio >= 1) {
    // Below average - 1-3% of subscribers watch each video
    engagementRate = 1 + (subscriberViewRatio - 1) / 2;
  } else {
    // Poor engagement - less than 1% of subscribers watch each video
    engagementRate = subscriberViewRatio;
  }
  
  const details = {
    viewsPerVideo: Math.round(viewsPerVideo),
    subscriberViewRatio: subscriberViewRatio.toFixed(2),
    subscriberCount: parseInt(subscriberCount),
    totalViews: parseInt(viewCount),
    totalVideos: parseInt(videoCount),
    estimatedAvgWatchTime: calculateEstimatedWatchTime(viewsPerVideo)
  };
  
  return {
    engagementRate: engagementRate.toFixed(2),
    evaluation: evaluateEngagementRate(engagementRate),
    details
  };
};

/**
 * Helper function to estimate watch time
 * @param {number} viewsPerVideo - Views per video
 * @returns {number} - Estimated watch time in hours
 */
function calculateEstimatedWatchTime(viewsPerVideo) {
  // Assume average watch duration is 40-60% of video length
  // For a typical 10 minute video, that's 4-6 minutes per view
  // We'll use 4.5 minutes (270 seconds) as an average watch time
  const avgWatchTimeInSeconds = 270;
  
  // Calculate total watch time in hours
  const totalWatchTimeInSeconds = viewsPerVideo * avgWatchTimeInSeconds;
  const totalWatchTimeInHours = totalWatchTimeInSeconds / 3600;
  
  return Math.round(totalWatchTimeInHours);
} 