const { getAPIStats } = require('../utils/stats');
const os = require('os');
const process = require('process');

module.exports = (req, res) => {
  try {
    const stats = getAPIStats();
    
    // Get API health information
    const health = {
      status: 'operational',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      loadAverage: os.loadavg(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    };
    
    // Get recent requests (mock data - in real app you'd track this)
    const recentRequests = [
      { endpoint: '/v1/random', timestamp: new Date(Date.now() - 10000).toISOString() },
      { endpoint: '/v2/image?id=42', timestamp: new Date(Date.now() - 30000).toISOString() },
      { endpoint: '/v1/anime?name=Naruto', timestamp: new Date(Date.now() - 45000).toISOString() }
    ];
    
    res.json({
      api: 'AniQuotes API',
      version: '2.1.0',
      credit: 'GitHub/Shineii86',
      status: 'alive',
      health,
      stats,
      recentRequests,
      documentation: 'https://github.com/AniQuotes/Documentation',
      endpoints: {
        v1: {
          random: '/v1/random',
          anime: '/v1/anime?name=;anime',
          character: '/v1/character?name=:character'
        },
        v2: {
          languages: '/v2/languages?lang=:lang',
          image: '/v2/image?id=:id'
        },
        status: '/status'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      creator: 'GitHub/Shineii86',
      zero: 'Created with ❤️ by Shinei Nouzen'
    });
  }
};
