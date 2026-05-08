# Curlix — Architecture Decisions

This document explains *why* Curlix is built the way it is. The README covers *what* the system does and *how* a request flows through it; this is the design rationale for the choices that would otherwise look arbitrary.

---

## 1. Owner tokens instead of user accounts

**The decision:** every short link is owned by a 32-byte bearer token, hashed with bcrypt and stored alongside the URL row. The plaintext token is shown to the user once at creation and persisted in `localStorage`.

**Why:**
- The product is a URL shortener for one-off links. Forcing signup for "shorten this link real quick" is hostile UX and kills conversion.
- Accounts are an enormous surface area: password reset, email verification, OAuth, session cookies, CSRF, account recovery, GDPR deletion. None of that is the actual product.
- The bearer-token model maps cleanly to the real authorization need: *"prove you created this link to edit or delete it."* Nothing more.

**The trade-off:** lose your `localStorage` (clear browser, switch device), lose access to your links. This is communicated explicitly at creation. For a free, anonymous tool this is the correct trade — accounts can be added later without breaking the existing model (an account would just collect a list of token-owned links).

**Why bcrypt the token instead of storing it raw?** A database leak would otherwise hand attackers the ability to delete or rewrite every link. With bcrypt at 12 rounds, the dump alone is useless without the original tokens.

---

## 2. BullMQ for analytics, not synchronous `INSERT`

**The decision:** the redirect handler enqueues a click event and returns `302` immediately. A separate worker process consumes the queue and writes to Postgres.

**Why:**
- The redirect path is the one place latency genuinely matters. A user clicked a link; every millisecond is felt. Adding a synchronous `INSERT INTO analytics` to that path couples redirect latency to DB write latency, including the DB's worst day.
- Click traffic is bursty (a tweet goes viral). A queue absorbs bursts that would otherwise hammer connection pools.
- Decoupling the writer means analytics outages don't become redirect outages. If Postgres is slow, jobs queue up; redirects keep flying.

**Why BullMQ specifically?** We already have Redis for the cache and rate limiter. BullMQ is the queue that costs us zero new infrastructure — it's a Redis client. Adding RabbitMQ or SQS would mean another service, another set of credentials, another failure mode. The queue isn't doing anything fancy enough to justify that.

**Why not just `setImmediate(insert)`?** That works until the process restarts mid-flight and you silently lose the in-memory pending writes. A persisted queue survives a deploy.

---

## 3. Redis as a 24-hour write-through cache

**The decision:** every `urls` row is mirrored to Redis with a 24-hour TTL. Reads check Redis first; misses hit Postgres and warm the cache.

**Why 24 hours?**
- Short links exhibit heavy tail traffic — most clicks land on a recently-created link, but a long-tail of older links keeps trickling in. 24 hours covers the recency hump while letting cold links fall out of memory.
- Upstash bills on commands and storage. An infinite TTL would balloon the working set; a 1-minute TTL would defeat the cache.
- 24 h means a manually-rotated long_url propagates within a day in the worst case. We also explicitly `DEL` the cache on update/delete, so propagation is immediate on the modify path.

**Why write-through and not write-back?** Postgres is the source of truth — analytics joins, schema migrations, and recovery all happen there. The cache is an accelerator, not a database. Write-through means a Redis flush is recoverable; write-back would mean a flush is data loss.

**Why JSON-encoded blobs and not Redis hashes?** The shape is small and read whole every time. A `GET` + `JSON.parse` is faster than `HGETALL` for a few fields, and the serialization is dead-simple to evolve.

---

## 4. Tiered rate limits, all in Redis

**The decision:** three rate-limit buckets, each scoped to client IP, all backed by `INCR + EXPIRE` in Redis.

| Endpoint | Limit | Window | Why |
|---|---|---|---|
| `POST /api/shorten` | 10 | 1 min | Anti-abuse — abuse here is link creation spam |
| `GET /:code` | 120 | 1 min | Anti-scraping — should comfortably absorb real traffic |
| `PATCH/DELETE /api/links/:code` | 5 | 15 min | Anti-brute-force — guessing owner tokens |

**Why these tiers?** Each endpoint has a different abuse profile. A single bucket would either be too tight for redirects or too loose for mutations. The mutate window is long because a successful brute-force needs to make millions of attempts; capping it at 5 / 15min makes that infeasible.

**Why Redis instead of [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit) in-process?** The API will horizontally scale; in-process counters would let an attacker hit each instance up to its limit. Redis gives a global view across all replicas.

**Fail open on Redis errors.** If Redis is unreachable, the rate limiter logs and calls `next()`. Reasoning: a redirect outage is a much worse user experience than a brief window where rate limiting is degraded. The captcha and DB-level constraints are still in place.

---

## 5. Two health endpoints, not one

**The decision:** `/health` is a cheap liveness probe (always 200 if the process is alive). `/health/ready` actively probes Postgres, Redis, and queue depth, with timeouts, returning 503 if any dependency is unhealthy.

**Why split them?** They answer different questions, and conflating them causes outages.
- A load balancer or uptime pinger asking *"is this process up?"* must not be 503'd when Redis blips. Otherwise you create cascade failures: Redis hiccups → readiness fails → LB removes all instances → no service.
- A deployment system asking *"is this instance ready to take traffic?"* needs to know about deps, not just the process.

The split mirrors Kubernetes' `livenessProbe` vs. `readinessProbe`, which is the right model even when the platform isn't K8s.

---

## 6. What would change at 100× scale

The current design comfortably handles ~10M redirects/month on the free tiers. Things that would change beyond that:

- **Read replicas for Postgres.** Right now everything hits a single primary via pgBouncer. The analytics dashboard query is the heaviest read; it'd move to a replica.
- **Materialized rollups for analytics.** `getAnalytics()` does a `COUNT(*)` and group-bys on every dashboard hit. Past a few million clicks per link this needs a daily-rollup table refreshed by the worker.
- **Per-region edge cache.** A click in Sydney hitting a US-based Render instance is ~200 ms of latency we can't optimize away in our code. Cloudflare Workers + KV would put the Redis layer at the edge.
- **Geo-IP enrichment.** We currently grab `cf-ipcountry` if Cloudflare is in front; otherwise country is null. A real solution is MaxMind in the worker.
- **Token rotation / link transfer.** Currently you cannot move ownership. Adding that means optional accounts (see §1), which is a strategic product decision, not just an engineering one.

These are deliberate omissions, not oversights. Building any of them now would be premature.

---

## 7. What this codebase deliberately does *not* have

- **An ORM.** Raw SQL through `pg`. The schema has two tables; an ORM is more code and more abstraction for no benefit at this size.
- **A test suite.** Honest trade-off for a portfolio project on a deadline. The contract surface is small (4 endpoints) and manually exercised. The first tests I'd add are unit tests around `urlService` (collision retry, token verification, expiry) since those have the most subtle logic.
- **Microservices.** The worker is a separate *process* (so it can be deployed and scaled independently), not a separate service. Same repo, same code, same deploy pipeline.
- **Authentication middleware framework.** Bearer-token verification is 5 lines of bcrypt; pulling in Passport for that is overkill.

The principle: every dependency and every abstraction has to earn its place. Two-table schemas don't need ORMs. Four-endpoint APIs don't need OpenAPI generators. The codebase is small on purpose.
