const UAParser = require('ua-parser-js');
const db = require('../db/connection');

function enqueueClickEvent(payload) {
  setImmediate(async () => {
    try {
      const { urlId, referrer, userAgent, country, ipHash, clickedAt } = payload;

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
    } catch (err) {
      console.error('Analytics insert failed:', err.message);
    }
  });
}

module.exports = { enqueueClickEvent };
