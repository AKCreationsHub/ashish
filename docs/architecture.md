# Architecture Blueprint (Detailed)

## 1) Product shape

A single web codebase powers:
- Desktop browser app
- Mobile browser app
- Installable PWA (iOS + Android)
- Android native wrapper path via Capacitor

## 2) Layered architecture

### Frontend layer
- Module-oriented SPA/Next.js routes:
  - Dashboard
  - Connected Accounts
  - Research Engine
  - Content Studio
  - Scheduler
  - Analytics
  - Monetization
  - Competitors
  - Notifications
  - Assistant
  - Settings
- State management:
  - local prototype state for UX flow validation
  - production path: server-backed state + optimistic UI updates

### API/BFF layer
- Authentication and session APIs
- OAuth connect/callback/token refresh APIs
- Research aggregation APIs
- Content generation orchestration APIs
- Scheduler/publish APIs
- Analytics ingestion and reporting APIs

### Worker layer
- Research ingestion jobs (source polling)
- AI generation jobs (script/voice/visual)
- Scheduler execution jobs (publish + retries)
- Analytics synchronization jobs

### Data layer
- PostgreSQL for relational app data
- Object storage for media assets (voice/images/video exports)
- Redis for queues, rate-limit counters, ephemeral cache

## 3) Security baseline

- OAuth 2.0 with least-privilege scopes per platform
- Encrypted token storage at rest
- Access/refresh lifecycle with rotation
- Request validation and sanitization at API edges
- CSRF protection and strict CORS policy
- Per-user API usage monitoring + rate-limits
- Audit logs for publish and credential events

## 4) Reliability baseline

- Retry policy for transient publish/API failures
- Dead-letter queue for failed jobs
- Health checks for platform integrations
- Idempotent publish operations where possible
- Structured logging and error correlation IDs

## 5) Rollout plan

1. **Foundation**: auth + accounts + settings + schema migrations
2. **Research + Studio**: trend ingestion + script workflow
3. **Scheduling + Publishing**: queue execution + retries + logs
4. **Analytics + Monetization**: ETL + dashboards + exports
5. **Mobile/PWA hardening**: offline behavior + install + capacitor packaging
