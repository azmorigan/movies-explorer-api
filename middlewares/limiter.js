const rateLimit = require('express-rate-limit');

// 1008 запросов в день с одного IP
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1008,
});

module.exports = limiter;
