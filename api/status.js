const { getAPIStats } = require('../utils/stats');
const os = require('os');
const process = require('process');

module.exports = (req, res) => {
  try {
    const stats = getAPIStats();

    // Sort quotesByAnime and quotesByCharacter in DESCENDING order by number (value)
    const sortedQuotesByAnime = Object.fromEntries(
      Object.entries(stats.quotesByAnime).sort((a, b) => b[1] - a[1])
    );

    const sortedQuotesByCharacter = Object.fromEntries(
      Object.entries(stats.quotesByCharacter).sort((a, b) => b[1] - a[1])
    );

    // Replace original stats with sorted versions
    stats.quotesByAnime = sortedQuotesByAnime;
    stats.quotesByCharacter = sortedQuotesByCharacter;

    const health = {
      status: 'operational',
      uptime: process.uptime(),
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal
      },
      load: os.loadavg(),
      node: process.version,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      api: 'AniQuotes API',
      version: '2.5 Beta',
      status: 'alive',
      health,
      stats,
      meta: {
        creator: 'Shinei Nouzen',
        github: 'https://github.com/Shineii86',
        telegram: 'https://telegram.me/Shineii86'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      meta: {
        creator: 'Shinei Nouzen',
        github: 'https://github.com/Shineii86',
        telegram: 'https://telegram.me/Shineii86'
      }
    });
  }
};
