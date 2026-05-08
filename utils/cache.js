/**
 * In-memory response cache with TTL
 * Works across a single serverless invocation.
 * For cross-invocation persistence, pair with HTTP Cache-Control headers.
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Get a cached value
   * @param {string} key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Store a value with TTL
   * @param {string} key
   * @param {*} value
   * @param {number} ttlMs - Time to live in milliseconds
   */
  set(key, value, ttlMs) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  /**
   * Get cached value or compute and cache it
   * @param {string} key
   * @param {Function} computeFn - Async function that returns the value
   * @param {number} ttlMs - Cache TTL in milliseconds
   * @returns {*} Cached or computed value
   */
  async getOrCompute(key, computeFn, ttlMs) {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    const value = await computeFn();
    this.set(key, value, ttlMs);
    return value;
  }

  /**
   * Check if a key exists and is not expired
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key
   * @param {string} key
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Clear all entries
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get cache stats
   * @returns {{ size: number, keys: string[] }}
   */
  stats() {
    return {
      size: this.store.size,
      keys: [...this.store.keys()]
    };
  }
}

// Singleton instance
const cache = new MemoryCache();

module.exports = { MemoryCache, cache };
