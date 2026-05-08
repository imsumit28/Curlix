const crypto = require('crypto');

// Daily salt rotates at midnight so deduplication works within a day
// but cross-day tracking is impossible
function getDailySalt() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return today;
}

function hashIp(ip) {
  const salt = getDailySalt();
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

function getClientIp(req) {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0'
  );
}

module.exports = { hashIp, getClientIp };
