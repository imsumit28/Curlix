const validator = require('validator');

// Private/reserved IP ranges to block (SSRF protection)
const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^localhost$/i,
];

const RESERVED_CODES = new Set([
  'api', 'health', 'metrics', 'admin', 'static', 'assets',
  'favicon.ico', 'robots.txt', 'sitemap.xml',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
]);

const ALIAS_REGEX = /^[a-zA-Z0-9_-]{2,50}$/;

function isPrivateUrl(urlString) {
  try {
    const { hostname } = new URL(urlString);
    return PRIVATE_IP_RANGES.some((re) => re.test(hostname));
  } catch {
    return true;
  }
}

function validateLongUrl(url) {
  if (!url || typeof url !== 'string') return 'URL is required';
  if (!validator.isURL(url, { require_protocol: true, protocols: ['http', 'https'] })) {
    return 'URL must start with http:// or https://';
  }
  if (isPrivateUrl(url)) return 'URL points to a private or reserved address';
  return null;
}

function validateAlias(alias) {
  if (!alias) return null;
  if (!ALIAS_REGEX.test(alias)) {
    return 'Alias must be 2–50 characters: letters, numbers, underscores, hyphens only';
  }
  if (RESERVED_CODES.has(alias.toLowerCase())) {
    return 'This alias is reserved';
  }
  return null;
}

module.exports = { validateLongUrl, validateAlias, RESERVED_CODES };
