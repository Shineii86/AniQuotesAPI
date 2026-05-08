/**
 * Animechan API Provider
 * Docs: https://animechan.io/docs
 * Base URL: https://api.animechan.io/v1
 *
 * Free tier: 5 requests/hour — aggressive caching is critical.
 */
const { cache } = require('../cache');

const BASE_URL = 'https://api.animechan.io/v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (matches Animechan rate window)

/**
 * Normalize an Animechan quote to AniQuotes format
 */
function normalize(raw) {
  return {
    id: null, // Animechan doesn't expose stable IDs
    quote: raw.content,
    anime: raw.anime?.name || 'Unknown',
    character: raw.character?.name || 'Unknown',
    language: 'en',
    source: 'animechan'
  };
}

/**
 * Fetch with timeout
 */
async function safeFetch(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Get a random quote from Animechan
 * @returns {Object|null} Normalized quote or null on failure
 */
async function getRandom() {
  const cacheKey = 'animechan:random';
  return cache.getOrCompute(cacheKey, async () => {
    try {
      const data = await safeFetch(`${BASE_URL}/quotes/random`);
      if (data?.status === 'success' && data.data) {
        return normalize(data.data);
      }
      return null;
    } catch (err) {
      console.error('[Animechan] Random quote failed:', err.message);
      return null;
    }
  }, CACHE_TTL);
}

/**
 * Get quotes by anime name
 * @param {string} animeName
 * @returns {Object[]} Normalized quotes (empty array on failure)
 */
async function getByAnime(animeName) {
  const cacheKey = `animechan:anime:${animeName.toLowerCase()}`;
  return cache.getOrCompute(cacheKey, async () => {
    try {
      const data = await safeFetch(`${BASE_URL}/quotes/anime?title=${encodeURIComponent(animeName)}`);
      if (data?.status === 'success' && Array.isArray(data.data)) {
        return data.data.map(normalize);
      }
      return [];
    } catch (err) {
      console.error(`[Animechan] Anime quotes failed for "${animeName}":`, err.message);
      return [];
    }
  }, CACHE_TTL);
}

/**
 * Get quotes by character name
 * @param {string} charName
 * @returns {Object[]} Normalized quotes (empty array on failure)
 */
async function getByCharacter(charName) {
  const cacheKey = `animechan:char:${charName.toLowerCase()}`;
  return cache.getOrCompute(cacheKey, async () => {
    try {
      const data = await safeFetch(`${BASE_URL}/quotes/character?name=${encodeURIComponent(charName)}`);
      if (data?.status === 'success' && Array.isArray(data.data)) {
        return data.data.map(normalize);
      }
      return [];
    } catch (err) {
      console.error(`[Animechan] Character quotes failed for "${charName}":`, err.message);
      return [];
    }
  }, CACHE_TTL);
}

module.exports = { getRandom, getByAnime, getByCharacter, name: 'animechan' };
