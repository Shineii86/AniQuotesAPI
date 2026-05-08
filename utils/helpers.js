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
 * Get N random items from an array (Fisher-Yates shuffle)
 * @param {Array} arr
 * @param {number} count
 * @returns {Array} Random subset
 */
exports.getRandomItems = (arr, count) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Paginate an array
 * @param {Array} arr
 * @param {number} offset - Starting index
 * @param {number} limit - Max items to return
 * @returns {{ items: Array, total: number, offset: number, limit: number, hasMore: boolean }}
 */
exports.paginate = (arr, offset = 0, limit = 3) => {
  const total = arr.length;
  const items = arr.slice(offset, offset + limit);
  return {
    items,
    total,
    offset,
    limit,
    hasMore: offset + limit < total
  };
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

/**
 * Search quotes by text across multiple fields (quote, anime, character)
 * @param {Array} quotes
 * @param {string} query - Search text
 * @returns {Array} Matching quotes
 */
exports.searchQuotes = (quotes, query) => {
  if (!query) return quotes;
  const q = query.toLowerCase();
  return quotes.filter(item =>
    String(item.quote).toLowerCase().includes(q) ||
    String(item.anime).toLowerCase().includes(q) ||
    String(item.character).toLowerCase().includes(q)
  );
};
