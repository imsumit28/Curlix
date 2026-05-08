# Curlix — Setup Guide

## Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier)
- An [Upstash Redis](https://upstash.com) database (free tier)
- A [Cloudflare Turnstile](https://dash.cloudflare.com/) site (free)

---

## 1. Database (Supabase)

1. Create a new Supabase project.
2. Open **SQL Editor** and run the contents of `backend/src/db/schema.sql`.
3. Copy the **Transaction pooler** connection string (port `6543`) from **Project Settings → Database**.

---

## 2. Redis (Upstash)

1. Create an Upstash Redis database.
2. From the **Details** tab, copy:
   - **Endpoint** (hostname, e.g. `xyz.upstash.io`)
   - **Port** (typically `6379`)
   - **Password**
3. Enable **TLS** (it's on by default for Upstash).

---

## 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in .env with your Supabase, Upstash, and Turnstile credentials
npm install
npm run dev
```

The API starts on **http://localhost:3001**.

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase connection string (port 6543 for pooling in prod) |
| `REDIS_HOST` | Upstash Redis hostname |
| `REDIS_PORT` | 6379 |
| `REDIS_PASSWORD` | Upstash Redis password |
| `REDIS_TLS` | `true` for Upstash |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server-side secret |
| `BCRYPT_SALT_ROUNDS` | `12` |
| `BASE_URL` | Public backend URL (e.g. `https://your-app.onrender.com`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `https://curlix.vercel.app`) |

---

## 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL
# Set VITE_TURNSTILE_SITE_KEY to your Turnstile site key
npm install
npm run dev
```

The app opens on **http://localhost:5173**.

---

## 5. Deployment

### Backend → Render (Free)

1. Push code to GitHub.
2. Create a new **Web Service** on Render, link your repo.
3. Set **Root Directory** to `backend`.
4. **Build command**: `npm install`
5. **Start command**: `node src/server.js`
6. Add all environment variables from `.env.example`.
7. Add a `/health` monitor on **UptimeRobot** (ping every 5 min) to prevent cold starts.

### Frontend → Vercel (Free)

1. Import the repo on Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   - `VITE_API_BASE_URL` = your Render URL
   - `VITE_TURNSTILE_SITE_KEY` = your Turnstile site key
4. Deploy.

---

## 6. Cloudflare Turnstile (Bot Protection)

1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/) → **Add site**.
2. Copy the **Site key** → `VITE_TURNSTILE_SITE_KEY` in frontend.
3. Copy the **Secret key** → `TURNSTILE_SECRET_KEY` in backend.
4. In development, skip CAPTCHA by leaving `TURNSTILE_SECRET_KEY` unset — the middleware auto-skips it.

---

## Architecture Overview

```
Browser → Vercel (React SPA)
             ↓ POST /api/shorten
             ↓ GET /api/analytics/:code
             ↓ DELETE /api/links/:code
         Render (Express API)
             ↓ Redis L1 cache         → Upstash Redis
             ↓ PostgreSQL persistence → Supabase
             ↓ BullMQ queue           → Upstash Redis
             ↓ Analytics worker (in-process)
```

**Redirect latency target**: <10ms on cache hit (Redis only).  
**Analytics writes**: Fully async via BullMQ — never block redirects.
