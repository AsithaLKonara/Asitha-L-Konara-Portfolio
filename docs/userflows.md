# Portfolio Userflows

## Public Visitor Journey

```mermaid
flowchart TD
  LP[Landing `/`] --> CTA1[Explore Projects CTA]
  LP --> CTA2[Hire Me CTA]
  LP --> CTA3[Download Résumé CTA]
  LP --> CTA4[Read Articles CTA]
  LP --> CTA5[View Services CTA]
  LP --> CTA6[Testimonials CTA]

  CTA1 --> PL[Projects Listing `/projects`]
  PL --> PC[Project Detail `/projects/[slug]`]
  PC --> CTA2
  PC --> CTA3

  CTA4 --> BL[Blog Listing `/blog`]
  BL --> BP[Article Detail `/blog/[slug]`]
  BP --> CTA2
  BP --> CTA1

  CTA5 --> SL[Services Overview `/services`]
  SL --> CTA2

  CTA6 --> TL[Testimonials Gallery `/testimonials`]
  TL --> CTA2

  CTA2 --> CF[Contact Form `/contact`]
  CF --> API_CONTACT[POST `/api/contact`<br/>validate & persist]
  API_CONTACT --> THANKS[Inline success state + optional Slack webhook]

  CTA3 --> RESUME[PDF download `/resume.pdf`]
```

**Behavior Notes**
- Landing page previews featured projects, services, testimonials, and latest articles fetched via Prisma-backed data utilities.
- Contact submission shows inline validation, posts JSON to `/api/contact`, persists to `ContactSubmission`, and optionally notifies Slack.
- Each deep-dive page (projects, blog) provides cross-links back to contact and résumé CTAs, keeping the user in the conversion loop.

## Authenticated Admin Journey

```mermaid
flowchart LR
  LOGIN[Login `/login`] -->|POST email/password| API_LOGIN[POST `/api/auth/login`<br/>Zod validate + bcrypt check]
  API_LOGIN -->|Valid| JWT[Set JWT cookie]
  API_LOGIN -->|Invalid| LOGIN_ERROR[Inline error message]

  JWT --> MDW[middleware.ts<br/>inserts `x-admin-id` header]
  MDW --> ADM_DASH[Admin Layout `/admin/*`]

  ADM_DASH --> OVERVIEW[`/admin` Overview stats]
  ADM_DASH --> PROJ_UI[`/admin/projects` Projects Manager]
  ADM_DASH --> ART_UI[`/admin/articles` Articles Manager]
  ADM_DASH --> SERV_UI[`/admin/services` Services Manager]
  ADM_DASH --> TEST_UI[`/admin/testimonials` Testimonials Manager]

  PROJ_UI -->|Create| API_PROJ_POST[POST `/api/admin/projects`]
  PROJ_UI -->|Update| API_PROJ_PUT[PUT `/api/admin/projects/{id}`]
  PROJ_UI -->|Delete| API_PROJ_DEL[DELETE `/api/admin/projects/{id}`]

  ART_UI -->|Create/Update/Delete| API_ART[/api/admin/articles{,/{id}} routes]
  SERV_UI -->|Create/Update/Delete| API_SERV[/api/admin/services{,/{id}} routes]
  TEST_UI -->|Create/Update/Delete| API_TEST[/api/admin/testimonials{,/{id}} routes]

  API_PROJ_POST --> DB[(Prisma write)]
  API_PROJ_PUT --> DB
  API_PROJ_DEL --> DB
  API_ART --> DB
  API_SERV --> DB
  API_TEST --> DB

  ADM_DASH --> SIGNOUT[Sign Out button]
  SIGNOUT --> API_LOGOUT[POST `/api/auth/logout`]
  API_LOGOUT --> CLEAR[Clear JWT cookie]
  CLEAR --> LOGIN
```

**Security & Session Notes**
- Middleware enforces JWT presence for both page requests and `/api/admin/*` calls, redirecting browsers to `/login` with a `redirectTo` parameter or returning 401 for API clients.
- Admin forms convert `FormData` to JSON payloads, call REST endpoints, and sync local component state after mutation.
- Sign-out clears the cookie and redirects to login; visiting `/login` while authenticated jumps directly to `/admin`.

## Data Touchpoints Reference

| Flow | Relevant Routes | Storage Layer | Notifications |
| --- | --- | --- | --- |
| Contact Submission | `/contact` → `/api/contact` | `ContactSubmission` table | Optional Slack webhook via `SLACK_WEBHOOK_URL` |
| Admin Login | `/login` → `/api/auth/login` | `AdminUser` table (password hash) | N/A |
| Admin CRUD (Projects/Articles/Services/Testimonials) | `/admin/*` → `/api/admin/...` | Corresponding Prisma models | N/A |
| Vercel Deployment Insight | `/admin` → `getLatestVercelDeployment()` → `https://api.vercel.com/v13/deployments` | Vercel API (read-only) | N/A |
| Public Content Rendering | `/`, `/projects`, `/blog`, etc. | Cached Prisma fetchers in `src/lib/data.ts` | N/A |


