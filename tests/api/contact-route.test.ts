import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";
import { contactSchema } from "@/lib/validation/contact";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn().mockResolvedValue({ id: "1" }),
    },
  },
}));

const prismaModule = await import("@/lib/prisma");
const createSpy = vi.mocked(prismaModule.prisma.contactSubmission.create);

describe("POST /api/contact", () => {
  const validPayload = {
    name: "Asitha",
    email: "asitha@example.com",
    message: "We would love to discuss automation at our org.",
    subject: "Automation strategy",
    company: "Atlas",
  };

  it("accepts a valid payload", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ message: expect.any(String) });
    expect(createSpy).toHaveBeenCalledWith({
      data: expect.objectContaining(contactSchema.parse(validPayload)),
    });
  });

  it("returns validation errors for invalid payloads", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "invalid", message: "hi" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.message).toBe("Validation failed");
    expect(body.issues).toBeDefined();
  });

  it("handles unexpected errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    createSpy.mockRejectedValueOnce(new Error("db down"));

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    errorSpy.mockRestore();
  });
});
