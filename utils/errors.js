const metadata = {
  creator: "Shinei Nouzen",
  github: "https://github.com/Shineii86",
  telegram: "https://telegram.me/Shineii86",
  timestamp: () => new Date().toISOString()
};

exports.handleError = (res, status = 500, message = "An unexpected error occurred") => {
  res.status(status).json({
    status: "error",
    error: {
      code: status,
      message
    },
    meta: {
      ...metadata,
      timestamp: metadata.timestamp()
    }
  });
};

exports.rateLimitExceeded = (res) => {
  res.status(429).json({
    status: "error",
    error: {
      code: 429,
      message: "Rate limit exceeded. Max 100 requests per hour."
    },
    meta: {
      ...metadata,
      timestamp: metadata.timestamp()
    }
  });
};
