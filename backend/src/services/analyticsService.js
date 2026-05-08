const db = require('../db/connection');

async function getAnalytics(shortCode) {
  // Verify code exists
  const urlResult = await db.query(
    `SELECT id FROM urls WHERE short_code = $1 AND is_active = true`,
    [shortCode]
  );
  if (urlResult.rows.length === 0) return null;

  const urlId = urlResult.rows[0].id;

  const [totalResult, byDayResult, deviceResult, referrerResult] = await Promise.all([
    // Total clicks
    db.query(`SELECT COUNT(*) AS total FROM analytics WHERE url_id = $1`, [urlId]),

    // Clicks by day (last 30 days)
    db.query(
      `SELECT date_trunc('day', clicked_at) AS day, COUNT(*) AS clicks
       FROM analytics
       WHERE url_id = $1 AND clicked_at >= now() - interval '30 days'
       GROUP BY day ORDER BY day ASC`,
      [urlId]
    ),

    // Device breakdown
    db.query(
      `SELECT device_type, COUNT(*) AS count
       FROM analytics WHERE url_id = $1
       GROUP BY device_type`,
      [urlId]
    ),

    // Top referrers
    db.query(
      `SELECT COALESCE(referrer, 'Direct') AS referrer, COUNT(*) AS count
       FROM analytics WHERE url_id = $1
       GROUP BY referrer ORDER BY count DESC LIMIT 10`,
      [urlId]
    ),
  ]);

  return {
    totalClicks: parseInt(totalResult.rows[0].total, 10),
    clicksByDay: byDayResult.rows.map((r) => ({
      day: r.day,
      clicks: parseInt(r.clicks, 10),
    })),
    deviceBreakdown: deviceResult.rows.reduce((acc, r) => {
      acc[r.device_type || 'unknown'] = parseInt(r.count, 10);
      return acc;
    }, {}),
    topReferrers: referrerResult.rows.map((r) => ({
      referrer: r.referrer,
      count: parseInt(r.count, 10),
    })),
  };
}

module.exports = { getAnalytics };
