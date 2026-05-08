const db = require('../db/connection');
const { getRedisClient } = require('../services/cacheService');
const { getAnalyticsQueue } = require('../queues/analyticsQueue');

const startedAt = Date.now();

async function check(promise, timeoutMs = 1500) {
  const start = Date.now();
  let timer;
  try {
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    });
    const result = await Promise.race([promise, timeout]);
    return { ok: true, latencyMs: Date.now() - start, ...result };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function checkPostgres() {
  return check(
    db.query('SELECT 1 AS ok').then(() => ({}))
  );
}

async function checkRedis() {
  return check(
    (async () => {
      const client = getRedisClient();
      const pong = await client.ping();
      return { reply: pong };
    })()
  );
}

async function checkQueue() {
  return check(
    (async () => {
      const queue = getAnalyticsQueue();
      const counts = await queue.getJobCounts('waiting', 'active', 'delayed', 'failed', 'completed');
      return { jobs: counts };
    })()
  );
}

async function health(req, res) {
  const [postgres, redis, queue] = await Promise.all([
    checkPostgres(),
    checkRedis(),
    checkQueue(),
  ]);

  const allOk = postgres.ok && redis.ok && queue.ok;

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    checks: { postgres, redis, queue },
  });
}

// Lightweight liveness probe — used by uptime monitors that just need a 200
function ping(req, res) {
  res.json({ status: 'ok', ts: Date.now() });
}

module.exports = { health, ping };
