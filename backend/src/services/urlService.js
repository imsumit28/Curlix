const { nanoid } = require('nanoid');
const db = require('../db/connection');
const { getCachedUrl, setCachedUrl, deleteCachedUrl } = require('./cacheService');
const { generateOwnerToken, hashToken, verifyToken } = require('../utils/tokenUtils');

async function createShortUrl({ longUrl, alias, expiresAt }) {
  const rawToken = generateOwnerToken();
  const tokenHash = await hashToken(rawToken);

  let shortCode = alias || nanoid(8);

  // For generated codes, handle the rare collision with a retry
  if (!alias) {
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.query(
        'SELECT id FROM urls WHERE short_code = $1',
        [shortCode]
      );
      if (existing.rows.length === 0) break;
      shortCode = nanoid(8);
      attempts++;
    }
  }

  const result = await db.query(
    `INSERT INTO urls (short_code, long_url, owner_token_hash, custom_alias, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, short_code, long_url, created_at, expires_at`,
    [shortCode, longUrl, tokenHash, alias || null, expiresAt || null]
  );

  const row = result.rows[0];

  await setCachedUrl(shortCode, { longUrl: row.long_url, expiresAt: row.expires_at, urlId: row.id });

  return { ...row, ownerToken: rawToken };
}

async function resolveShortCode(shortCode) {
  // Redis first
  const cached = await getCachedUrl(shortCode);
  if (cached) {
    if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) return null;
    return { fromCache: true, ...cached };
  }

  // PostgreSQL fallback
  const result = await db.query(
    `SELECT id, long_url, expires_at FROM urls
     WHERE short_code = $1 AND is_active = true`,
    [shortCode]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  if (row.expires_at && new Date(row.expires_at) < new Date()) return null;

  // Warm the cache
  await setCachedUrl(shortCode, { longUrl: row.long_url, expiresAt: row.expires_at, urlId: row.id });

  return { fromCache: false, longUrl: row.long_url, expiresAt: row.expires_at, urlId: row.id };
}

async function deleteShortUrl(shortCode, rawToken) {
  const result = await db.query(
    `SELECT id, owner_token_hash FROM urls WHERE short_code = $1 AND is_active = true`,
    [shortCode]
  );

  if (result.rows.length === 0) return { success: false, reason: 'not_found' };

  const row = result.rows[0];
  const valid = await verifyToken(rawToken, row.owner_token_hash);
  if (!valid) return { success: false, reason: 'unauthorized' };

  await db.query(`UPDATE urls SET is_active = false WHERE id = $1`, [row.id]);
  await deleteCachedUrl(shortCode);

  return { success: true };
}

async function updateShortUrl(shortCode, rawToken, updates) {
  const result = await db.query(
    `SELECT id, owner_token_hash FROM urls WHERE short_code = $1 AND is_active = true`,
    [shortCode]
  );

  if (result.rows.length === 0) return { success: false, reason: 'not_found' };

  const row = result.rows[0];
  const valid = await verifyToken(rawToken, row.owner_token_hash);
  if (!valid) return { success: false, reason: 'unauthorized' };

  const { longUrl, expiresAt } = updates;
  const updated = await db.query(
    `UPDATE urls SET long_url = COALESCE($1, long_url), expires_at = $2
     WHERE id = $3 RETURNING id, short_code, long_url, expires_at`,
    [longUrl || null, expiresAt !== undefined ? expiresAt : undefined, row.id]
  );

  await deleteCachedUrl(shortCode);

  return { success: true, url: updated.rows[0] };
}

module.exports = { createShortUrl, resolveShortCode, deleteShortUrl, updateShortUrl };
