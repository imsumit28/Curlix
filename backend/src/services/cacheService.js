const Redis = require('ioredis');

let redis;

function getRedisClient() {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err.message);
    });
  }
  return redis;
}

const REDIRECT_TTL = 86400; // 24 hours in seconds

async function getCachedUrl(shortCode) {
  try {
    const client = getRedisClient();
    const value = await client.get(`url:${shortCode}`);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Cache get error:', err.message);
    return null;
  }
}

async function setCachedUrl(shortCode, urlData) {
  try {
    const client = getRedisClient();
    await client.set(`url:${shortCode}`, JSON.stringify(urlData), 'EX', REDIRECT_TTL);
  } catch (err) {
    console.error('Cache set error:', err.message);
  }
}

async function deleteCachedUrl(shortCode) {
  try {
    const client = getRedisClient();
    await client.del(`url:${shortCode}`);
  } catch (err) {
    console.error('Cache delete error:', err.message);
  }
}

module.exports = { getRedisClient, getCachedUrl, setCachedUrl, deleteCachedUrl };
