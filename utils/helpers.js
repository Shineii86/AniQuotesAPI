const fs = require('fs');
const path = require('path');

// In-memory cache to avoid reading files repeatedly
const quotesCache = new Map();

/**
 * Read the master (English) quotes file
 * @returns {Array} List of all quotes
 */
exports.readMasterQuotes = () => {
  if (quotesCache.has('master')) return quotesCache.get('master');

  const filePath = path.join(process.cwd(), 'data', 'quotes.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  quotesCache.set('master', data);
  return data;
};

/**
 * Read quotes from a specific language file (fallback: English)
 * @param {string} lang - Language code (e.g., 'en', 'jp')
 * @returns {Array} List of quotes in the requested language
 */
exports.readLanguageQuotes = (lang = 'en') => {
  const cacheKey = `lang-${lang}`;
  if (quotesCache.has(cacheKey)) return quotesCache.get(cacheKey);

  try {
    const filePath = lang === 'en'
      ? path.join(process.cwd(), 'data', 'quotes.json')
      : path.join(process.cwd(), 'data', 'languages', `${lang}.json`);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    quotesCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') return []; // Graceful fallback
    throw error;
  }
};

/**
 * Get a random quote from a given list
 * @param {Array} quotes
 * @returns {Object} Random quote object
 */
exports.getRandomQuote = (quotes) => {
  if (!Array.isArray(quotes) || quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Find a quote by ID with optional language fallback
 * @param {number|string} id
 * @param {string} lang
 * @returns {Object|null} Quote object or null if not found
 */
exports.findQuoteById = (id, lang = 'en') => {
  const quotes = exports.readLanguageQuotes(lang);
  const quote = quotes.find(q => q.id === parseInt(id, 10));

  if (!quote && lang !== 'en') {
    const masterQuotes = exports.readMasterQuotes();
    return masterQuotes.find(q => q.id === parseInt(id, 10)) || null;
  }

  return quote || null;
};

/**
 * Filter quotes by a key and value (case-insensitive substring match)
 * @param {Array} quotes
 * @param {string} key
 * @param {string} value
 * @returns {Array} Filtered list of quotes
 */
exports.filterQuotes = (quotes, key, value) => {
  if (!value) return quotes;
  return quotes.filter(item =>
    String(item[key]).toLowerCase().includes(value.toLowerCase())
  );
};
