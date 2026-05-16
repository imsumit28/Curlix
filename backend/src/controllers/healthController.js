const db = require('../db/connection');

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

async function health(req, res) {
  const postgres = await checkPostgres();

  res.status(postgres.ok ? 200 : 503).json({
    status: postgres.ok ? 'ok' : 'degraded',
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    checks: { postgres },
  });
}

// Lightweight liveness probe — used by uptime monitors that just need a 200
function ping(req, res) {
  res.json({ status: 'ok', ts: Date.now() });
}

module.exports = { health, ping };
