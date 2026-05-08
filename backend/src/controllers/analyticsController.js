const { getAnalytics } = require('../services/analyticsService');
const { verifyToken } = require('../utils/tokenUtils');
const db = require('../db/connection');

async function analytics(req, res, next) {
  try {
    const { code } = req.params;
    const rawToken = (req.headers['authorization'] || '').replace('Bearer ', '');

    if (!rawToken) return res.status(401).json({ error: 'Unauthorized' });

    // Verify token before returning analytics
    const urlResult = await db.query(
      `SELECT owner_token_hash FROM urls WHERE short_code = $1 AND is_active = true`,
      [code]
    );

    if (urlResult.rows.length === 0) return res.status(404).json({ error: 'Link not found' });

    const valid = await verifyToken(rawToken, urlResult.rows[0].owner_token_hash);
    if (!valid) return res.status(401).json({ error: 'Unauthorized' });

    const data = await getAnalytics(code);
    if (!data) return res.status(404).json({ error: 'Link not found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { analytics };
