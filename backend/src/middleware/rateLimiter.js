const { getRedisClient } = require('../services/cacheService');

function makeRateLimiter({ windowMs, max, prefix, message }) {
  return async function (req, res, next) {
    try {
      const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown';

      const key = `${prefix}${ip}`;
      const windowSec = Math.floor(windowMs / 1000);
      const client = getRedisClient();

      const count = await client.incr(key);
      if (count === 1) await client.expire(key, windowSec);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));

      if (count > max) {
        return res.status(429).json({ error: message || 'Too many requests, please try again later.' });
      }
      next();
    } catch (err) {
      // If Redis is down, fail open (don't block requests)
      console.error('Rate limiter error:', err.message);
      next();
    }
  };
}

const createLimiter = makeRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  prefix: 'rl:create:',
  message: 'Too many requests, please try again later.',
});

const redirectLimiter = makeRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  prefix: 'rl:redirect:',
  message: 'Too many requests.',
});

const mutateLimiter = makeRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  prefix: 'rl:mutate:',
  message: 'Too many edit/delete attempts. Try again later.',
});

module.exports = { createLimiter, redirectLimiter, mutateLimiter };
