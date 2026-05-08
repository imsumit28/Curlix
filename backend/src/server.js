require('dotenv').config();
const app = require('./app');
const { getAnalyticsQueue } = require('./queues/analyticsQueue');

const PORT = process.env.PORT || 3001;

// Start BullMQ worker in-process (shares process with API on Render free tier)
if (process.env.NODE_ENV !== 'test') {
  require('./workers/analyticsWorker');
}

app.listen(PORT, () => {
  console.log(`Curlix API running on port ${PORT}`);
  // Pre-warm the queue connection
  getAnalyticsQueue();
});
