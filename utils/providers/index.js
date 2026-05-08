/**
 * Provider Manager
 * Aggregates quotes from external APIs and local data.
 * External providers are tried first; local data is the fallback.
 */
const { cache } = require('../cache');
const { readMasterQuotes, getRandomQuote, getRandomItems, filterQuotes, searchQuotes } = require('../helpers');

// External providers — add new ones here
const providers = [
  require('./animechan'),
];

const LOCAL_CACHE_TTL = 5 * 60 * 1000; // 5 min for local data

/**
 * Get a random quote — tries providers first, falls back to local
 * @returns {Object} Quote object
 */
async function getRandom() {
  // Try external providers
  for (const provider of providers) {
    try {
      const quote = await provider.getRandom();
      if (quote) return quote;
    } catch (err) {
      console.error(`[Providers] ${provider.name} failed:`, err.message);
    }
  }

  // Fallback: local data
  const localQuotes = readMasterQuotes();
  return getRandomQuote(localQuotes);
}

/**
 * Get quotes by anime — merges provider results with local data
 * @param {string} animeName
 * @param {number} limit
 * @returns {{ quotes: Object[], total: number, sources: string[] }}
 */
async function getByAnime(animeName, limit = 3) {
  const results = [];
  const sources = [];

  // Try external providers
  for (const provider of providers) {
    try {
      const quotes = await provider.getByAnime(animeName);
      if (quotes.length > 0) {
        results.push(...quotes);
        sources.push(provider.name);
      }
    } catch (err) {
      console.error(`[Providers] ${provider.name} anime failed:`, err.message);
    }
  }

  // Merge with local data
  const localQuotes = readMasterQuotes();
  const localFiltered = filterQuotes(localQuotes, 'anime', animeName);
  if (localFiltered.length > 0) {
    results.push(...localFiltered);
    sources.push('local');
  }

  // Deduplicate by quote text
  const seen = new Set();
  const unique = results.filter(q => {
    const key = q.quote.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    quotes: getRandomItems(unique, limit),
    total: unique.length,
    sources: [...new Set(sources)]
  };
}

/**
 * Get quotes by character — merges provider results with local data
 * @param {string} charName
 * @param {number} limit
 * @returns {{ quotes: Object[], total: number, sources: string[] }}
 */
async function getByCharacter(charName, limit = 3) {
  const results = [];
  const sources = [];

  // Try external providers
  for (const provider of providers) {
    try {
      const quotes = await provider.getByCharacter(charName);
      if (quotes.length > 0) {
        results.push(...quotes);
        sources.push(provider.name);
      }
    } catch (err) {
      console.error(`[Providers] ${provider.name} character failed:`, err.message);
    }
  }

  // Merge with local data
  const localQuotes = readMasterQuotes();
  const localFiltered = filterQuotes(localQuotes, 'character', charName);
  if (localFiltered.length > 0) {
    results.push(...localFiltered);
    sources.push('local');
  }

  // Deduplicate
  const seen = new Set();
  const unique = results.filter(q => {
    const key = q.quote.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    quotes: getRandomItems(unique, limit),
    total: unique.length,
    sources: [...new Set(sources)]
  };
}

/**
 * Search quotes across all sources
 * @param {string} query
 * @param {number} limit
 * @returns {{ quotes: Object[], total: number }}
 */
async function search(query, limit = 5) {
  // Search only works on local data (external APIs don't support full-text search)
  const localQuotes = readMasterQuotes();
  const results = searchQuotes(localQuotes, query);
  return {
    quotes: results.slice(0, limit),
    total: results.length
  };
}

/**
 * Get provider health status
 * @returns {Object[]}
 */
function getProviderStatus() {
  return providers.map(p => ({
    name: p.name,
    type: 'external'
  }));
}

module.exports = {
  getRandom,
  getByAnime,
  getByCharacter,
  search,
  getProviderStatus
};
