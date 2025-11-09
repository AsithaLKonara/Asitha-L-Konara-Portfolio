import type { AdminUser } from "@/generated/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/auth/login/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    adminUser: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  verifyPassword: vi.fn(),
  signAuthToken: vi.fn(),
  createAuthCookie: vi.fn(),
}));

const prismaModule = await import("@/lib/prisma");
const authModule = await import("@/lib/auth");

const prismaMock = vi.mocked(prismaModule.prisma);
const authMock = {
  verifyPassword: vi.mocked(authModule.verifyPassword),
  signAuthToken: vi.mocked(authModule.signAuthToken),
  createAuthCookie: vi.mocked(authModule.createAuthCookie),
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = "test-secret";
});

describe("POST /api/auth/login", () => {
  it("logs in with valid credentials", async () => {
    const adminUser: AdminUser = {
      id: "1",
      email: "admin@example.com",
      passwordHash: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.adminUser.findUnique.mockResolvedValue(adminUser);

    authMock.verifyPassword.mockResolvedValue(true);
    authMock.signAuthToken.mockResolvedValue("signed-token");
    authMock.createAuthCookie.mockReturnValue({
      name: "portfolio_admin_token",
      value: "signed-token",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60,
    });

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "password123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Logged in" });
    expect(authMock.createAuthCookie).toHaveBeenCalledWith("signed-token");
  });

  it("rejects unknown users", async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(null);

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "password123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("validates payload", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
