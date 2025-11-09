import { expect, test } from "@playwright/test";

test.describe("Public user flows", () => {
  test("homepage highlights key sections and navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /AI Engineer & Automation Developer/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Hire Me" }).nth(1)).toBeVisible();

    const projectsLink = page.getByRole("link", { name: "Explore Projects" }).first();
    await expect(projectsLink).toHaveAttribute("href", "/projects");
    await projectsLink.click();
    await page.waitForURL(/\/projects$/, { timeout: 60_000 });
    await expect(page.getByRole("heading", { name: /Automation platforms and agents in production/i })).toBeVisible();
  });

  test("project detail page renders case study content", async ({ page }) => {
    await page.goto("/projects");

    const firstProject = page.locator("a[href^='/projects/']").first();
    const projectTitle = await firstProject.locator("h3").textContent();

    await Promise.all([page.waitForURL(/\/projects\/.+/), firstProject.click()]);
    if (projectTitle) {
      await expect(page.getByRole("heading", { level: 1, name: projectTitle.trim() })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Challenges" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Solution" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Outcomes", exact: true }).first()).toBeVisible();
  });

  test("blog article is accessible from listing", async ({ page }) => {
    await page.goto("/blog");

    const firstArticleCard = page.locator("a[href^='/blog/']").first();
    const articleTitle = await firstArticleCard.locator("h2").textContent();

    await Promise.all([page.waitForURL(/\/blog\/.+/), firstArticleCard.click()]);
    if (articleTitle) {
      await expect(page.getByRole("heading", { level: 1, name: articleTitle.trim() })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "← Back to tech insights" })).toBeVisible();
  });

  test("contact form submits successfully", async ({ page }) => {
    await page.goto("/contact");

    const timestamp = Date.now();
    await page.getByLabel("Name").fill(`Playwright User ${timestamp}`);
    await page.getByLabel("Email").fill(`e2e-${timestamp}@example.com`);
    await page.getByLabel("Company").fill("Playwright Inc.");
    await page.getByLabel("Subject").fill("Automation Inquiry");
    await page.getByLabel("Project details").fill("Looking to automate end-to-end tests with Playwright.");

    const responsePromise = page.waitForResponse(
      (response) => response.url().endsWith("/api/contact") && response.status() === 201,
    );
    await page.getByRole("button", { name: "Send message" }).click();
    await responsePromise;
    await expect(
      page.getByText("Thanks for reaching out! I'll reply within 48 hours."),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Email")).toHaveValue("");
  });
});

