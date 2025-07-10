const { getAPIStats } = require('../utils/stats');
const os = require('os');
const process = require('process');

module.exports = (req, res) => {
  try {
    const rawStats = getAPIStats();

    // Sort helper
    const sortByValueDesc = (obj) =>
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {});

    const health = {
      status: 'operational',
      uptime: parseFloat(process.uptime().toFixed(9)),
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal
      },
      load: os.loadavg(),
      node: process.version,
      timestamp: new Date().toISOString()
    };

    const sortedStats = {
      totalQuotes: rawStats.totalQuotes,
      quotesByLanguage: sortByValueDesc(rawStats.quotesByLanguage || {}),
      quotesByAnime: sortByValueDesc(rawStats.quotesByAnime || {}),
      quotesByCharacter: sortByValueDesc(rawStats.quotesByCharacter || {}),
      supportedLanguages: rawStats.supportedLanguages || [],
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        timestamp: new Date().toISOString()
      }
    };

    res.json({
      api: "AniQuotes API",
      version: "2.5-Beta",
      status: "alive",
      health,
      stats: sortedStats,
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86"
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86"
      }
    });
  }
};
