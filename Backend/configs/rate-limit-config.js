const rateLimit = require('express-rate-limit');

const limiter = (rate,requests) => rateLimit({
    windowMs: rate * 1000,
    max: requests, 
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;

