# Web Security Scanner

A TypeScript backend service that scans a target URL for common web security weaknesses, with a focus on HTTP security headers and SSL/TLS certificate health.

## Current Status

The project currently includes:

- Express server bootstrap and middleware setup
- URL validation and private-host blocking using Zod
- Security checks for:
  - HTTP security headers
  - SSL/TLS certificate validity and expiry
- PostgreSQL setup with Docker Compose
- Drizzle ORM database connection scaffold

## Tech Stack

- Node.js + TypeScript (`NodeNext`)
- Express
- Zod
- `ssl-checker`
- PostgreSQL (`pg`)
- Drizzle ORM + Drizzle Kit
- Docker Compose

## Project Flow

1. A client sends a scan request with a `url`.
2. Input is validated by schema rules in `src/validators/scan.validator.ts`:
   - URL is required
   - URL format is valid
   - Protocol must be `http` or `https`
   - Host must not be a private/internal address
3. The controller extracts the hostname from the URL.
4. Two checks run in parallel:
   - `checkHeaders(url)`
   - `checkSSL(hostname)`
5. Results are merged into a single `findings` array and returned as JSON.

## Code Structure

- `src/server.ts`
  - Starts the app and verifies DB connectivity via `testDatabaseConnection()`.
- `src/app.ts`
  - Sets up `helmet`, JSON parsing, and rate limiting.
- `src/controllers/scans.controller.ts`
  - Handles scan requests and orchestrates checks.
- `src/validators/scan.validator.ts`
  - Validates scan input and blocks private/internal host targets.
- `src/services/checks/headers.ts`
  - Checks key security headers and returns scored findings.
- `src/services/checks/ssl.ts`
  - Checks certificate validity and days remaining.
- `src/config/database.ts`
  - Creates Postgres pool + Drizzle instance.
- `src/middleware/errorHandler.ts`
  - Centralized error middleware.

## Security Checks Implemented

### HTTP Security Headers

The scanner currently checks:

- `Content-Security-Policy` (high)
- `Strict-Transport-Security` (high)
- `X-Frame-Options` (medium)
- `X-Content-Type-Options` (low)
- `Referrer-Policy` (low)

### SSL/TLS

The scanner checks:

- Whether a certificate is valid
- Whether it expires in 30 days or fewer (warning)
- Whether HTTPS is missing/invalid (critical fail)

## Environment Variables

Use a `.env` file with values like:

- `PORT` (default `5000`)
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST_PORT`

## Docker (PostgreSQL)

Start Postgres:

```bash
docker compose up -d
```

Default setup maps host port `5436` to Postgres container port `5432` (configurable via env vars).

## Scripts

```bash
npm run dev         # Start in watch mode
npm run build       # TypeScript build
npm run start       # Run built server
npm run db:generate # Generate drizzle migration
npm run db:migrate  # Run migrations
npm run db:studio   # Open Drizzle Studio
```

## Next Steps

- Wire scan routes in `app.ts` if not already mounted
- Apply validation middleware at route level
- Mount `errorHandler` as the last middleware
- Add tests for validators, controller, and checks
- Persist scan history/findings to PostgreSQL
