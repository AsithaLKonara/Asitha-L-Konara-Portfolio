import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { testimonialInputSchema } from "@/lib/validation/admin";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

async function requireAdmin() {
  const headersList = await headers();
  const adminId = headersList.get("x-admin-id");

  if (adminId) {
    return adminId;
  }

  const cookie = headersList.get("cookie");
  if (!cookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tokenMatch = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!tokenMatch) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = tokenMatch.slice(AUTH_COOKIE_NAME.length + 1);
  const payload = await verifyAuthToken(token);

  if (!payload?.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return payload.sub;
}

export async function GET() {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  try {
    const raw = await request.json();
    const parsed = testimonialInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid testimonial data" }, { status: 400 });
    }

    const data = parsed.data;

    const testimonial = await prisma.testimonial.create({
      data: {
        slug: data.slug,
        name: data.name,
        role: data.role,
        quote: data.quote,
        avatarImage: data.avatarImage ?? null,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial", error);
    return NextResponse.json({ message: "Failed to create testimonial" }, { status: 500 });
  }
}
