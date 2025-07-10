const { getAPIStats } = require('../utils/stats');
const os = require('os');
const process = require('process');

module.exports = (req, res) => {
  try {
    const stats = getAPIStats();

    // Sort quotesByAnime and quotesByCharacter in ascending order
    const sortedQuotesByAnime = Object.fromEntries(
      Object.entries(stats.quotesByAnime).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const sortedQuotesByCharacter = Object.fromEntries(
      Object.entries(stats.quotesByCharacter).sort((a, b) => a[0].localeCompare(b[0]))
    );

    // Replace unsorted stats with sorted ones
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
      version: '2.5',
      status: 'alive',
      health,
      stats,
      meta: {
        creator: 'Shinei Nouzen',
        github: 'https://github.com/Shineii86',
        telegram: 'https://telegram.me/Shineii86'
      },
      endpoints: {
        v1: {
          random: '/v1/random',
          anime: '/v1/anime?name=:anime',
          character: '/v1/character?name=:character'
        },
        v2: {
          languages: '/v2/languages?lang=:lang',
          image: '/v2/image?id=:id'
        }
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
