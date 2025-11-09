import type { Article } from "@/generated/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/articles/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    article: {
      create: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

const prismaModule = await import("@/lib/prisma");
const headersModule = await import("next/headers");

const prismaMock = vi.mocked(prismaModule.prisma);
const headersMock = vi.mocked(headersModule.headers);

const validPayload = {
  slug: "new-article",
  title: "New Article",
  excerpt: "Short insight",
  contentHtml: "<p>Hello world</p>",
  publishedAt: "2024-01-01",
  readingTime: "4 min read",
  coverImage: "data:image/png;base64,dGVzdA==",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/admin/articles", () => {
  it("requires authentication", async () => {
    headersMock.mockResolvedValue(new Headers());

    const response = await POST(
      new Request("http://localhost/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("creates an article when authorized", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-admin-id": "admin" }));
    const createdArticle: Article = {
      id: "1",
      slug: validPayload.slug,
      title: validPayload.title,
      excerpt: validPayload.excerpt,
      contentHtml: validPayload.contentHtml,
      coverImage: validPayload.coverImage,
      publishedAt: new Date(validPayload.publishedAt),
      readingTime: validPayload.readingTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.article.create.mockResolvedValue(createdArticle);

    const response = await POST(
      new Request("http://localhost/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    );

    expect(response.status).toBe(201);
    expect(prismaMock.article.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: validPayload.slug,
        contentHtml: validPayload.contentHtml,
        coverImage: validPayload.coverImage,
      }),
    });
  });

  it("validates payload", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-admin-id": "admin" }));

    const response = await POST(
      new Request("http://localhost/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "" }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
