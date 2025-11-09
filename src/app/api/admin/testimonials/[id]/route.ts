import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { testimonialInputSchema } from "@/lib/validation/admin";

async function requireAdmin() {
  const headersList = await headers();
  const adminId = headersList.get("x-admin-id");

  if (!adminId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return adminId;
}

function getTestimonialId(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1] ?? "";
}

export async function PUT(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getTestimonialId(request);
  if (!id) {
    return NextResponse.json({ message: "Testimonial id missing" }, { status: 400 });
  }

  try {
    const raw = await request.json();
    const parsed = testimonialInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid testimonial data" }, { status: 400 });
    }

    const data = parsed.data;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        role: data.role,
        quote: data.quote,
        avatarImage: data.avatarImage ?? null,
      },
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Failed to update testimonial", error);
    return NextResponse.json({ message: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getTestimonialId(request);
  if (!id) {
    return NextResponse.json({ message: "Testimonial id missing" }, { status: 400 });
  }

  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete testimonial", error);
    return NextResponse.json({ message: "Failed to delete testimonial" }, { status: 500 });
  }
}
