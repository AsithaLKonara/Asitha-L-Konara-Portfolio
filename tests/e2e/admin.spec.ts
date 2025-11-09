import { expect, test } from "@playwright/test";

import { getAdminCredentials } from "../utils/reset-db";

test.describe.serial("Admin dashboard flows", () => {
  async function login(page: Parameters<typeof test>[0]["page"]) {
    const credentials = getAdminCredentials();

    await page.goto("/login");
    await page.getByLabel("Email").fill(credentials.email);
    await page.getByLabel("Password").fill(credentials.password);
    const [loginResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith("/api/auth/login")),
      page.getByRole("button", { name: "Sign in" }).click(),
    ]);

    const loginStatus = loginResponse.status();
    expect(loginStatus, "login response status").toBe(200);
    await page.goto("/admin");
  }

  test("admin overview renders stats", async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL("/admin");
    await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
    await expect(page.getByText("Highlighted case studies")).toBeVisible();
    await expect(page.getByText("Latest inbound leads")).toBeVisible();
  });

  test("admin can create and delete a testimonial", async ({ page }) => {
    await login(page);

    await expect(page.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/admin/testimonials",
    );
    await page.goto("/admin/testimonials");

    const slug = `playwright-testimonial-${Date.now()}`;

    await page.getByLabel("Slug").first().fill(slug);
    await page.getByLabel("Name").first().fill("Playwright QA");
    await page.getByLabel("Role").first().fill("Automation Engineer");
    await page.getByLabel("Quote").first().fill("Playwright ensures the portfolio admin stays rock solid.");

    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/admin/testimonials") && response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Create testimonial" }).click(),
    ]);
    expect(createResponse.status(), "create testimonial status").toBe(201);

    await expect(page.getByText("Testimonial created")).toBeVisible();
    const slugInput = page.locator(`form input[name="slug"][value="${slug}"]`).first();
    await expect(slugInput).toBeVisible();
    const createdCard = slugInput.locator("xpath=ancestor::form[1]");

    const [deleteResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes(`/api/admin/testimonials/`) && response.request().method() === "DELETE",
      ),
      createdCard.getByRole("button", { name: "Delete" }).click(),
    ]);
    expect(deleteResponse.status(), "delete testimonial status").toBe(200);

    await expect(page.getByText("Testimonial deleted")).toBeVisible();
    await expect(createdCard).toHaveCount(0);
  });
});

