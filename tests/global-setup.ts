import { getAdminCredentials, resetDatabase } from "./utils/reset-db";

export default async function globalSetup() {
  const { email, password } = getAdminCredentials();

  process.env.ADMIN_EMAIL = email;
  process.env.ADMIN_PASSWORD = password;
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "playwright-test-secret";

  await resetDatabase();
}

