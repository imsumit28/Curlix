const { Queue } = require('bullmq');

let analyticsQueue;

function getAnalyticsQueue() {
  if (!analyticsQueue) {
    analyticsQueue = new Queue('analytics', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
  }
  return analyticsQueue;
}

async function enqueueClickEvent(payload) {
  try {
    const queue = getAnalyticsQueue();
    await queue.add('click', payload, { jobId: undefined });
  } catch (err) {
    // never let queue errors break the redirect path
    console.error('Failed to enqueue click event:', err.message);
  }
}

module.exports = { getAnalyticsQueue, enqueueClickEvent };
