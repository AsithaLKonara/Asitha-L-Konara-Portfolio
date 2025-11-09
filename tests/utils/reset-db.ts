import { execSync } from "node:child_process";

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "admin@playwright.test";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "Playwright!234";

export async function resetDatabase() {
  const databaseUrl =
    process.env.PLAYWRIGHT_DATABASE_URL ??
    process.env.DATABASE_URL ??
    process.env.LOCAL_DATABASE_URL ??
    `postgresql://postgres:postgres@localhost:5432/portfolio_e2e`;

  if (/supabase\.co/.test(databaseUrl)) {
    throw new Error(
      "Refusing to reset a Supabase production database. Set PLAYWRIGHT_DATABASE_URL or LOCAL_DATABASE_URL to a disposable Postgres instance before running Playwright tests.",
    );
  }

  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION:
      process.env.PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION ??
      "playwright-database-reset",
  };

  execSync("npx prisma migrate reset --force --skip-generate", {
    stdio: "inherit",
    env,
  });
}

export function getAdminCredentials() {
  return {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
}

