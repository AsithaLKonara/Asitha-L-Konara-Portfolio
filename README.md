# Asitha L Konara · Portfolio

A multi-page Next.js (App Router) portfolio showcasing automation-first products, services, testimonials, blog writing, and a gated contact workflow backed by Prisma + SQLite. The UI keeps a consistent glassmorphism theme across all routes.

## Features

- **Landing experience** with featured projects, services, testimonials, and blog teasers.
- **Deep-dive pages** for projects (`/projects/[slug]`), services, testimonials, and articles.
- **Contact workflow** posting to `/api/contact` with validation (Zod) and persistence via Prisma.
- **Central content layer** (`src/lib/content.ts`) powering summaries, case studies, articles, and navigation.
- **Shared UI components** for headings, cards, and call-to-action sections to maintain a cohesive look.

## Getting Started

```bash
npm install
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

Structured content for projects, case studies, services, testimonials, and articles lives in `src/lib/content.ts`.

- Add new projects to `projectSummaries` and `projectCaseStudies`.
- Extend testimonials, services, or articles by appending to their exported arrays.
- Navigation links are driven by the `navLinks` export used in the global header.

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
    api/contact/route.ts    # Contact form API handler
    blog/                   # Blog listing & article pages
    contact/                # Client-side contact form with fetch + state handling
    projects/               # Project listing & dynamic case study routes
    services/               # Services overview
    testimonials/           # Testimonials gallery
    layout.tsx              # Global fonts, header, footer shell
    page.tsx                # Landing page
  components/               # Reusable UI primitives (header, cards, CTA, etc.)
  lib/
    content.ts              # Central data model
    prisma.ts               # Prisma client singleton
    validation/contact.ts   # Shared Zod schema for contact payloads
  generated/prisma/         # Prisma client output (do not edit)
prisma/
  schema.prisma             # Database schema
  migrations/               # Migration history
```

## Deployment

- Ensure the `DATABASE_URL` environment variable is configured in your hosting provider.
- Run `npm run build` to produce an optimized bundle before deployment.
- For serverless platforms (e.g., Vercel), deploy with the default Next.js adapter; the API route runs in the Node.js runtime.

Feel free to tailor `src/lib/content.ts` and page components to reflect new projects, services, or writing as your portfolio evolves.
