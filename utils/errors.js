const { buildMeta } = require('./config');

/**
 * Send a standardized error response
 * @param {object} res - Vercel response object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 */
exports.handleError = (res, status = 500, message = "An unexpected error occurred") => {
  res.status(status).json({
    status: "error",
    error: {
      code: status,
      message
    },
    meta: buildMeta()
  });
};

/**
 * Send a 429 rate limit response
 * @param {object} res - Vercel response object
 */
exports.rateLimitExceeded = (res) => {
  res.status(429).json({
    status: "error",
    error: {
      code: 429,
      message: "Rate limit exceeded. Max 100 requests per hour."
    },
    meta: buildMeta()
  });
};
