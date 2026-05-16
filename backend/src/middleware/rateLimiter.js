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

      const pipeline = client.pipeline();
      pipeline.incr(key);
      pipeline.expire(key, windowSec, 'NX');
      const results = await pipeline.exec();
      const count = results[0][1];

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));

      if (count > max) {
        return res.status(429).json({ error: message || 'Too many requests, please try again later.' });
      }
      next();
    } catch (err) {
      console.error('Rate limiter error:', err.message);
      next();
    }
  };
}

// In-memory rate limiter for high-volume redirect endpoint (zero Redis cost)
const redirectCounts = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of redirectCounts) {
    if (now > entry.resetAt) redirectCounts.delete(key);
  }
}, 5 * 60 * 1000);

function redirectLimiter(req, res, next) {
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';

  const key = ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 120;

  const entry = redirectCounts.get(key);
  if (!entry || now > entry.resetAt) {
    redirectCounts.set(key, { count: 1, resetAt: now + windowMs });
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - 1);
    return next();
  }

  entry.count++;
  res.setHeader('X-RateLimit-Limit', max);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));

  if (entry.count > max) {
    return res.status(429).json({ error: 'Too many requests.' });
  }
  next();
}

const createLimiter = makeRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  prefix: 'rl:create:',
  message: 'Too many requests, please try again later.',
});

const mutateLimiter = makeRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  prefix: 'rl:mutate:',
  message: 'Too many edit/delete attempts. Try again later.',
});

module.exports = { createLimiter, redirectLimiter, mutateLimiter };
