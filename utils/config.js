/**
 * Shared API metadata and configuration
 */
module.exports = {
  CREATOR: "Shinei Nouzen",
  GITHUB: "https://github.com/Shineii86",
  TELEGRAM: "https://telegram.me/Shineii86",
  MESSAGE: "Build with ❤️ by Shinei Nouzen",

  /**
   * Build a standard meta object for API responses
   * @param {Object} [extra] - Additional meta fields to merge
   * @returns {Object} Meta object with creator info and timestamp
   */
  buildMeta(extra = {}) {
    return {
      creator: this.CREATOR,
      github: this.GITHUB,
      telegram: this.TELEGRAM,
      message: this.MESSAGE,
      timestamp: new Date().toISOString(),
      ...extra
    };
  }
};
