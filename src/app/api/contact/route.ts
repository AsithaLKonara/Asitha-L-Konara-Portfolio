import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const payload = contactSchema.parse(data);

    await prisma.contactSubmission.create({
      data: {
        name: payload.name,
        email: payload.email,
        company: payload.company,
        subject: payload.subject,
        message: payload.message,
      },
    });

    return NextResponse.json({ message: "Thanks for reaching out!" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", issues: error.flatten() },
        { status: 422 },
      );
    }

    console.error("Contact submission failed", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
