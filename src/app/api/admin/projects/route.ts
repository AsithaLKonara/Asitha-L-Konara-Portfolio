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

export async function GET() {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  try {
    const raw = await request.json();
    const parsed = projectInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid project data" }, { status: 400 });
    }

    const data = parsed.data;

    const project = await prisma.project.create({
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

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project", error);
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
  }
}
