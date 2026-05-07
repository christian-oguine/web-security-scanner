# Web Security Scanner

## What is this?

Backend API that scans a URL for basic web security issues.

## What is checks

- HTTP security headers
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
- SSL/TLS certificate
  - valid or invalid
  - expiry warning (30 days or less)

## Tech stack

- Node.js
- TypeScript
- Express
- Zod
- PostgreSQL
- Drizzle ORM
- Docker Compose

## Code structure

- `src/server.ts` - app startup
- `src/app.ts` - express setup and middleware
- `src/controllers/scans.controller.ts` - scan request handler
- `src/validators/scan.validator.ts` - URL validation rules
- `src/services/checks/headers.ts` - header checks
- `src/services/checks/ssl.ts` - SSL check
- `src/config/database.ts` - DB connection
- `src/middleware/` - shared middleware

## How to run project

1. Install packages:
   ```bash
   npm install
   ```
2. Add `.env` values (DB + app config).
3. Start Postgres:
   ```bash
   docker compose up -d
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## Docker DB (PostgreSQL)

The database runs in Docker.

```bash
docker compose up -d      # start postgres in background
docker compose ps         # check container status
docker compose logs -f db # watch database logs
docker compose down       # stop containers
```

## Scripts

```bash
npm run dev         # run server in watch mode (tsx)
npm run build       # compile TypeScript to dist/
npm run start       # run compiled app from dist/server.js
npm run db:generate # generate new drizzle migration files
npm run db:migrate  # apply migrations to database
npm run db:studio   # open drizzle studio UI
```

