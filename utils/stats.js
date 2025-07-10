const fs = require('fs');
const path = require('path');
const { readMasterQuotes, readLanguageQuotes } = require('./helpers');

// In-memory cache
let statsCache = null;
let lastUpdated = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Returns a list of supported language codes from /data/languages/*.json
 * @returns {string[]} Language codes (e.g., ['ja', 'es'])
 */
function getSupportedLanguages() {
  const languagesDir = path.join(process.cwd(), 'data', 'languages');

  try {
    return fs.readdirSync(languagesDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.basename(file, '.json'));
  } catch (error) {
    console.error('[APIStats] Failed to read languages directory:', error);
    return [];
  }
}

/**
 * Generates and caches API statistics
 * @returns {object} Structured statistics object
 */
module.exports.getAPIStats = () => {
  const now = Date.now();

  if (statsCache && (now - lastUpdated) < CACHE_DURATION) {
    return statsCache;
  }

  try {
    const masterQuotes = readMasterQuotes();
    const otherLangs = getSupportedLanguages();
    const supportedLanguages = ['en', ...otherLangs];

    const stats = {
      totalQuotes: 0,
      quotesByLanguage: {},
      quotesByAnime: {},
      quotesByCharacter: {},
      supportedLanguages,
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        message: "Build with ❤️ by Shinei Nouzen",
        timestamp: new Date().toISOString()
      }
    };

    // Count quotes by anime and character
    for (const { anime, character } of masterQuotes) {
      const a = anime.trim();
      const c = character.trim();
      stats.quotesByAnime[a] = (stats.quotesByAnime[a] || 0) + 1;
      stats.quotesByCharacter[c] = (stats.quotesByCharacter[c] || 0) + 1;
    }

    // Count quotes per language
    for (const lang of supportedLanguages) {
      try {
        const quotes = lang === 'en' ? masterQuotes : readLanguageQuotes(lang);
        const count = Array.isArray(quotes) ? quotes.length : 0;
        stats.quotesByLanguage[lang] = count;
        stats.totalQuotes += count;
      } catch (err) {
        console.error(`[APIStats] Error reading quotes for '${lang}':`, err);
        stats.quotesByLanguage[lang] = 0;
      }
    }

    statsCache = stats;
    lastUpdated = now;
    return stats;

  } catch (error) {
    console.error('[APIStats] Failed to generate statistics:', error);
    return {
      status: "error",
      message: "Unable to generate quote statistics",
      details: error.message,
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        message: "Build with ❤️ by Shinei Nouzen",
        timestamp: new Date().toISOString()
      }
    };
  }
};
