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

export async function GET() {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const services = await prisma.serviceOffering.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  try {
    const raw = await request.json();
    const parsed = serviceInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid service data" }, { status: 400 });
    }

    const data = parsed.data;

    const service = await prisma.serviceOffering.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        price: data.price,
        bullets: data.bullets,
        iconImage: data.iconImage ?? null,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Failed to create service", error);
    return NextResponse.json({ message: "Failed to create service" }, { status: 500 });
  }
}
