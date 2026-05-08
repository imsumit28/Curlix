const https = require('https');
const querystring = require('querystring');

async function verifyCaptcha(token) {
  return new Promise((resolve) => {
    const body = querystring.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    const options = {
      hostname: 'challenges.cloudflare.com',
      port: 443,
      path: '/turnstile/v0/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.success === true);
        } catch {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.write(body);
    req.end();
  });
}

async function captchaMiddleware(req, res, next) {
  // Skip in development if TURNSTILE_SECRET_KEY not configured
  if (!process.env.TURNSTILE_SECRET_KEY || process.env.NODE_ENV === 'development') {
    return next();
  }

  const token = req.headers['cf-turnstile-response'];
  if (!token) {
    return res.status(400).json({ error: 'CAPTCHA token required' });
  }

  const valid = await verifyCaptcha(token);
  if (!valid) {
    return res.status(403).json({ error: 'CAPTCHA verification failed' });
  }

  next();
}

module.exports = { captchaMiddleware };
