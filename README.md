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

The project uses SQLite (stored at `./dev.db`) through Prisma.

```bash
# Apply migrations & generate Prisma client
npx prisma migrate dev

# Open the Prisma Studio inspector (optional)
npx prisma studio
```

All contact submissions are stored in the `ContactSubmission` table. Update the `DATABASE_URL` inside `.env` if you switch databases.

## Content Management

Structured content now lives in the database. Seed data is located at `prisma/seed-data.ts`, and an authenticated admin dashboard at `/admin` lets you create, edit, and delete entries for projects, articles, services, and testimonials.

- Run `npm run prisma:migrate` and `npm run prisma:generate` to stay in sync with schema changes.
- Use `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` environment variables to control dashboard access.

## Testing & Quality

```bash
# Lint all files
npm run lint

# Run Vitest unit tests
npm run test

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
- Run `npm run build` to produce an optimized bundle before deployment.
- For serverless platforms (e.g., Vercel), deploy with the default Next.js adapter; the API route runs in the Node.js runtime.

Feel free to tailor the admin dashboard or seed data to reflect new projects, services, or writing as your portfolio evolves.
