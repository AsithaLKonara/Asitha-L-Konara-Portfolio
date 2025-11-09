import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { projectInputSchema } from "@/lib/validation/admin";

async function requireAdmin() {
  const headersList = await headers();
  const adminId = headersList.get("x-admin-id");

  if (!adminId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return adminId;
}

function getProjectId(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1] ?? "";
}

export async function PUT(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getProjectId(request);
  if (!id) {
    return NextResponse.json({ message: "Project id missing" }, { status: 400 });
  }

  try {
    const raw = await request.json();
    const parsed = projectInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid project data" }, { status: 400 });
    }

    const data = parsed.data;

    const project = await prisma.project.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        tagline: data.tagline,
        summary: data.summary,
        problem: data.problem,
        contribution: data.contribution,
        impact: data.impact,
        overview: data.overview ?? data.summary,
        challenges: data.challenges,
        solution: data.solution,
        outcomes: data.outcomes,
        stack: data.stack,
        tech: data.tech,
        heroImage: data.heroImage ?? null,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to update project", error);
    return NextResponse.json({ message: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getProjectId(request);
  if (!id) {
    return NextResponse.json({ message: "Project id missing" }, { status: 400 });
  }

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project", error);
    return NextResponse.json({ message: "Failed to delete project" }, { status: 500 });
  }
}
