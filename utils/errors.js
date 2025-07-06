exports.handleError = (res, status, message) => {
  res.status(status).json({
    error: message,
    credit: "GitHub/Shineii86"
  });
};

exports.rateLimitExceeded = (res) => {
  res.status(429).json({
    error: "Rate limit exceeded (100 Requests/Hour)",
    credit: "GitHub/Shineii86"
  });
};
