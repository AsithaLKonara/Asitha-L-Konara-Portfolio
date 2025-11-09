import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serviceInputSchema } from "@/lib/validation/admin";

async function requireAdmin() {
  const headersList = await headers();
  const adminId = headersList.get("x-admin-id");

  if (!adminId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return adminId;
}

function getServiceId(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1] ?? "";
}

export async function PUT(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getServiceId(request);
  if (!id) {
    return NextResponse.json({ message: "Service id missing" }, { status: 400 });
  }

  try {
    const raw = await request.json();
    const parsed = serviceInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid service data" }, { status: 400 });
    }

    const data = parsed.data;

    const service = await prisma.serviceOffering.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        price: data.price,
        bullets: data.bullets,
        iconImage: data.iconImage ?? null,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Failed to update service", error);
    return NextResponse.json({ message: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getServiceId(request);
  if (!id) {
    return NextResponse.json({ message: "Service id missing" }, { status: 400 });
  }

  try {
    await prisma.serviceOffering.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service", error);
    return NextResponse.json({ message: "Failed to delete service" }, { status: 500 });
  }
}
