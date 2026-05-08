# Web Security Scanner

A backend API that scans a target URL for common web security issues, computes a score/grade, and stores scan results in PostgreSQL.

## Features

- Run on-demand security scans via API
- Evaluate key HTTP security headers
- Check TLS certificate status and expiry
- Validate DMARC DNS record
- Detect exposed sensitive files (`/.env`, `/.git/config`)
- Calculate a security score (`0-100`) and grade (`A-F`)
- Persist scan results for later retrieval

## What It Checks

### 1) HTTP Header Checks

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Server` header disclosure
- `X-Powered-By` header disclosure

### 2) SSL/TLS Certificate

- Certificate present and valid
- Expired certificate detection
- Expiry warning when certificate has 30 days or fewer remaining

### 3) DNS / Email Security

- DMARC TXT record existence and policy (`none` vs enforcing policies)

### 4) Exposed Sensitive Files

- Public access check for `/.env`
- Public access check for `/.git/config`

## Tech Stack

- Node.js
- TypeScript
- Express
- Zod
- PostgreSQL
- Drizzle ORM
- Docker Compose

## API

Base path: `/api/scans`

### Create Scan

- `POST /api/scans`

Request body:

```json
{
  "url": "https://example.com"
}
```

Success response (`201`):

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "domain": "example.com",
  "grade": "B",
  "score": 72,
  "findings": [],
  "scanDurationMs": 1250,
  "scannedAt": "2026-05-08T12:00:00.000Z"
}
```

### Get Scan by ID

- `GET /api/scans/:id`

Success response (`200`):

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "domain": "example.com",
  "grade": "B",
  "score": 72,
  "findings": [],
  "scanDurationMs": 1250,
  "scannedAt": "2026-05-08T12:00:00.000Z"
}
```

Possible error responses:

- `400` validation failed (invalid URL, unsupported protocol, private/internal host)
- `404` scan not found
- `429` rate limit exceeded
- `500` internal server error

## Scoring

- Findings contribute points up to a maximum of `100`
- Grade thresholds:
  - `A`: 85-100
  - `B`: 70-84
  - `C`: 55-69
  - `D`: 40-54
  - `F`: 0-39
- Some critical findings trigger `autoFail`, forcing score `0` and grade `F`

## Project Structure

- `src/server.ts` - app startup and DB connection check
- `src/app.ts` - Express setup, middleware, and route registration
- `src/routes/scans.ts` - scan routes
- `src/controllers/scans.controller.ts` - scan creation and retrieval handlers
- `src/services/scanner.ts` - orchestrates all checks and scoring
- `src/services/scoring.ts` - score and grade calculation logic
- `src/services/checks/headers.ts` - header checks
- `src/services/checks/ssl.ts` - SSL/TLS check
- `src/services/checks/dns.ts` - DMARC check
- `src/services/checks/files.ts` - exposed file checks
- `src/validators/scan.validator.ts` - request validation
- `src/middleware/rateLimit.ts` - rate limiting
- `src/middleware/errorHandler.ts` - global error handling
- `src/config/database.ts` - database setup
- `src/db/schema.ts` - Drizzle schema

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env`, then set required values.

Required application variables:

- `DATABASE_URL` (PostgreSQL connection string, used by app and Drizzle)

Optional:

- `PORT` (defaults to `5000`)

The Docker-related variables in `.env.example` configure local PostgreSQL for `docker compose`.

### 3) Start PostgreSQL (Docker)

```bash
docker compose up -d
docker compose ps
```

### 4) Run DB migrations

```bash
npm run db:migrate
```

### 5) Start development server

```bash
npm run dev
```

## Scripts

```bash
npm run dev         # run server in watch mode (tsx)
npm run build       # compile TypeScript to dist/
npm run start       # run compiled app from dist/server.js
npm run db:generate # generate drizzle migration files
npm run db:migrate  # apply migrations
npm run db:studio   # open drizzle studio
```

## Notes

- Detailed check rationale, security implications, and design decisions can live in `docs/` as project documentation grows.

