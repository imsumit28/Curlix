require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Worker } = require('bullmq');
const UAParser = require('ua-parser-js');
const db = require('../db/connection');

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: null,
};

const worker = new Worker(
  'analytics',
  async (job) => {
    const { urlId, referrer, userAgent, country, ipHash, clickedAt } = job.data;

    let deviceType = 'unknown';
    if (userAgent) {
      const parser = new UAParser(userAgent);
      const device = parser.getDevice();
      if (device.type === 'mobile') deviceType = 'mobile';
      else if (device.type === 'tablet') deviceType = 'tablet';
      else deviceType = 'desktop';
    }

    await db.query(
      `INSERT INTO analytics (url_id, clicked_at, referrer, user_agent, device_type, country, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [urlId, clickedAt || new Date(), referrer || null, userAgent || null, deviceType, country || null, ipHash || null]
    );
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`Analytics job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Analytics job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err.message);
});

console.log('Analytics worker started');
