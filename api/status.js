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
        
    res.json({
      api: 'AniQuotes API',
      version: '2.5',
      source: 'AniQuotes/API',
      status: 'alive',
      health,
      stats,
      recentRequests,
      creator: 'GitHub/@Shineii86',
      message: 'Created with ❤️ by Shinei Nouzen'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      creator: 'GitHub/@Shineii86',
      message: 'Created with ❤️ by Shinei Nouzen'
    });
  }
};
