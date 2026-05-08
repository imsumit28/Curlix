const { Router } = require('express');
const { shorten, redirect, deleteLink, updateLink } = require('../controllers/urlController');
const { analytics } = require('../controllers/analyticsController');
const { health, ping } = require('../controllers/healthController');
const { createLimiter, redirectLimiter, mutateLimiter } = require('../middleware/rateLimiter');
const { captchaMiddleware } = require('../middleware/captchaVerifier');

const router = Router();

// Liveness probe — cheap, always returns 200 if the process is up (UptimeRobot, load balancers)
router.get('/health', ping);

// Readiness probe — actively probes Postgres, Redis, and the queue. Returns 503 if any dep is down.
router.get('/health/ready', health);

// API routes
router.post('/api/shorten', createLimiter, captchaMiddleware, shorten);
router.get('/api/analytics/:code', analytics);
router.delete('/api/links/:code', mutateLimiter, deleteLink);
router.patch('/api/links/:code', mutateLimiter, updateLink);

// Redirect — must be last (catches /:code)
router.get('/:code', redirectLimiter, redirect);

module.exports = router;
