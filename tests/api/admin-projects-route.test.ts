import type { Project } from "@/generated/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/projects/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
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
  slug: "new-project",
  title: "New Project",
  tagline: "An automation case study",
  summary: "Short summary",
  problem: "Problem statement",
  contribution: "Contribution",
  impact: "Impact",
  overview: "Overview",
  challenges: ["Challenge"],
  solution: ["Solution"],
  outcomes: ["Outcome"],
  stack: ["Stack"],
  tech: ["Tech"],
  featured: true,
  heroImage: "data:image/png;base64,dGVzdA==",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/admin/projects", () => {
  it("requires authentication", async () => {
    headersMock.mockResolvedValue(new Headers());

    const request = new Request("http://localhost/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("creates a project when authorized", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-admin-id": "admin" }));
    const createdProject: Project = {
      id: "1",
      slug: validPayload.slug,
      title: validPayload.title,
      tagline: validPayload.tagline,
      summary: validPayload.summary,
      problem: validPayload.problem,
      contribution: validPayload.contribution,
      impact: validPayload.impact,
      overview: validPayload.overview,
      challenges: validPayload.challenges,
      solution: validPayload.solution,
      outcomes: validPayload.outcomes,
      stack: validPayload.stack,
      tech: validPayload.tech,
      heroImage: validPayload.heroImage,
      featured: validPayload.featured,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.project.create.mockResolvedValue(createdProject);

    const request = new Request("http://localhost/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(prismaMock.project.create).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid payloads", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-admin-id": "admin" }));

    const request = new Request("http://localhost/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
