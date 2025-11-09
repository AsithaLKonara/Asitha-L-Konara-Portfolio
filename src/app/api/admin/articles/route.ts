import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { articleInputSchema } from "@/lib/validation/admin";

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

  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  try {
    const raw = await request.json();
    const parsed = articleInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid article data" }, { status: 400 });
    }

    const data = parsed.data;

    const article = await prisma.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        contentHtml: data.contentHtml,
        coverImage: data.coverImage ?? null,
        publishedAt: data.publishedAt,
        readingTime: data.readingTime,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Failed to create article", error);
    return NextResponse.json({ message: "Failed to create article" }, { status: 500 });
  }
}
