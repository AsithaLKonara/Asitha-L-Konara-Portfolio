import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const HOST = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ...(process.env.CI ? [["junit", { outputFile: "playwright-results.xml" }]] : [])],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
  },
  globalSetup: require.resolve("./tests/global-setup"),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev:test`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "development",
      ADMIN_EMAIL: process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "admin@playwright.test",
      ADMIN_PASSWORD: process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "Playwright!234",
      JWT_SECRET: process.env.JWT_SECRET ?? "playwright-test-secret",
    },
  },
});

