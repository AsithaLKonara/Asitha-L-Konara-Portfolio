# Asitha L Konara · Portfolio

A multi-page Next.js (App Router) portfolio showcasing automation-first products, services, testimonials, blog writing, and a gated contact workflow backed by Prisma + SQLite. The UI keeps a consistent glassmorphism theme across all routes.

## Features

- **Landing experience** with featured projects, services, testimonials, and blog teasers.
- **Deep-dive pages** for projects (`/projects/[slug]`), services, testimonials, and articles.
- **Contact workflow** posting to `/api/contact` with validation (Zod) and persistence via Prisma.
- **Admin dashboard** for managing projects, articles, services, and testimonials with JWT-protected access.
- **Shared UI components** for headings, cards, and call-to-action sections to maintain a cohesive look.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Editing any file inside `src/` triggers live reload.

## Database & Prisma

The project targets **PostgreSQL** (Supabase in production). Prisma reads the connection string from `DATABASE_URL`. For local development you can point to any Postgres instance—e.g. spin one up with Docker:

```bash
docker run --name portfolio-db -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:15

# set the local connection string (e.g. in .env.local)
LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_dev"
```

When `DATABASE_URL` is missing, the app falls back to `LOCAL_DATABASE_URL` (or `postgresql://postgres:postgres@localhost:5432/portfolio_dev`). The Playwright suite uses `PLAYWRIGHT_DATABASE_URL` if provided—always point it at a disposable database because the tests wipe the schema.

```bash
# Apply migrations & generate Prisma client against your local DB
DATABASE_URL="$LOCAL_DATABASE_URL" npx prisma migrate dev
DATABASE_URL="$LOCAL_DATABASE_URL" npm run prisma:generate

# Open Prisma Studio (optional)
DATABASE_URL="$LOCAL_DATABASE_URL" npx prisma studio
```

All contact submissions, testimonials, etc. are persisted in PostgreSQL tables. Update the `DATABASE_URL` / `LOCAL_DATABASE_URL` inside your `.env` files when you switch databases.

## Content Management

Structured content now lives in the database. Seed data is located at `prisma/seed-data.ts`, and an authenticated admin dashboard at `/admin` lets you create, edit, and delete entries for projects, articles, services, and testimonials.

- Run `npm run prisma:migrate` and `npm run prisma:generate` to stay in sync with schema changes.
- Use `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` environment variables to control dashboard access.
- To surface live deployment details in the admin overview, provide `VERCEL_ACCESS_TOKEN` and either `VERCEL_PROJECT_ID` or `VERCEL_PROJECT_NAME` (plus optional `VERCEL_TEAM_ID`). The token requires at least the **Deployments (read)** scope.
- For end-to-end tests, Playwright reset scripts expect `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, and a disposable `PLAYWRIGHT_DATABASE_URL`; defaults are provided in `tests/utils/reset-db.ts` when unset.

## Testing & Quality

```bash
# Lint all files
npm run lint

# Run Vitest unit tests
npm run test

# Run Playwright end-to-end tests (Chromium)
npm run test:e2e

# Build for production
npm run build
```

API route tests live in `tests/api/contact-route.test.ts`, covering validation paths and persistence logic. Vitest configuration with path aliases sits in `vitest.config.ts`.

## Project Structure

```
src/
  app/
    api/                   # Auth + admin CRUD + contact route handlers
    blog/                  # Blog listing & article pages
    contact/               # Client-side contact form with fetch + state handling
    login/                 # Admin sign-in experience
    projects/              # Project listing & dynamic case study routes
    services/              # Services overview
    testimonials/          # Testimonials gallery
    admin/                 # Dashboard shell & views
    layout.tsx             # Global fonts, header, footer shell
    page.tsx               # Landing page (server component)
  components/              # Reusable UI primitives and admin/client components
  lib/
    data.ts                # Prisma-backed data fetchers
    prisma.ts              # Prisma client singleton
    validation/            # Shared Zod schemas
  generated/prisma/        # Prisma client output (do not edit)
prisma/
  schema.prisma            # Database schema
  seed-data.ts             # Canonical seed content
  seed.ts                  # Seed script
  migrations/              # Migration history
```

## Deployment

- Ensure the `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` environment variables are configured in your hosting provider. Add `SLACK_WEBHOOK_URL` if you want contact submissions forwarded to Slack.
- Set `VERCEL_ACCESS_TOKEN` and project identifiers if you want the admin dashboard to display the latest Vercel deployment status.
- Run `npm run build` to produce an optimized bundle before deployment.
- For serverless platforms (e.g., Vercel), deploy with the default Next.js adapter; the API route runs in the Node.js runtime.

Feel free to tailor the admin dashboard or seed data to reflect new projects, services, or writing as your portfolio evolves.
