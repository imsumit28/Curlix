const { createShortUrl, resolveShortCode, deleteShortUrl, updateShortUrl } = require('../services/urlService');
const { enqueueClickEvent } = require('../queues/analyticsQueue');
const { validateLongUrl, validateAlias } = require('../utils/urlValidator');
const { hashIp, getClientIp } = require('../utils/ipUtils');
const db = require('../db/connection');

async function shorten(req, res, next) {
  try {
    const { long_url, alias, expires_at } = req.body;

    const urlError = validateLongUrl(long_url);
    if (urlError) return res.status(400).json({ error: urlError });

    if (alias) {
      const aliasError = validateAlias(alias);
      if (aliasError) return res.status(400).json({ error: aliasError });

      const existing = await db.query(
        'SELECT id FROM urls WHERE short_code = $1 OR custom_alias = $1',
        [alias]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'This alias is already taken' });
      }
    }

    const result = await createShortUrl({
      longUrl: long_url,
      alias: alias || null,
      expiresAt: expires_at || null,
    });

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${result.short_code}`;

    res.status(201).json({
      short_url: shortUrl,
      short_code: result.short_code,
      long_url: result.long_url,
      owner_token: result.ownerToken,
      created_at: result.created_at,
      expires_at: result.expires_at,
    });
  } catch (err) {
    next(err);
  }
}

async function redirect(req, res, next) {
  try {
    const { code } = req.params;
    const url = await resolveShortCode(code);

    if (!url) return res.status(404).json({ error: 'Short link not found or expired' });

    // Enqueue analytics job async — never block the redirect
    const ip = getClientIp(req);
    enqueueClickEvent({
      urlId: url.urlId,
      referrer: req.headers['referer'] || req.headers['referrer'] || null,
      userAgent: req.headers['user-agent'] || null,
      country: req.headers['cf-ipcountry'] || null,
      ipHash: hashIp(ip),
      clickedAt: new Date().toISOString(),
    });

    res.redirect(302, url.longUrl);
  } catch (err) {
    next(err);
  }
}

async function deleteLink(req, res, next) {
  try {
    const { code } = req.params;
    const rawToken = (req.headers['authorization'] || '').replace('Bearer ', '');

    if (!rawToken) return res.status(401).json({ error: 'Unauthorized' });

    const result = await deleteShortUrl(code, rawToken);

    if (result.reason === 'not_found') return res.status(404).json({ error: 'Link not found' });
    if (result.reason === 'unauthorized') return res.status(401).json({ error: 'Unauthorized' });

    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function updateLink(req, res, next) {
  try {
    const { code } = req.params;
    const rawToken = (req.headers['authorization'] || '').replace('Bearer ', '');

    if (!rawToken) return res.status(401).json({ error: 'Unauthorized' });

    const { long_url, expires_at } = req.body;

    if (long_url) {
      const urlError = validateLongUrl(long_url);
      if (urlError) return res.status(400).json({ error: urlError });
    }

    const result = await updateShortUrl(code, rawToken, { longUrl: long_url, expiresAt: expires_at });

    if (result.reason === 'not_found') return res.status(404).json({ error: 'Link not found' });
    if (result.reason === 'unauthorized') return res.status(401).json({ error: 'Unauthorized' });

    res.json({ message: 'Link updated', url: result.url });
  } catch (err) {
    next(err);
  }
}

module.exports = { shorten, redirect, deleteLink, updateLink };
