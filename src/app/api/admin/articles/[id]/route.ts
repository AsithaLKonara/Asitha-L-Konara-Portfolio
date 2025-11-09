import type { NextRequest } from "next/server";
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

function getArticleId(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1] ?? "";
}

export async function PUT(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getArticleId(request);
  if (!id) {
    return NextResponse.json({ message: "Article id missing" }, { status: 400 });
  }

  try {
    const raw = await request.json();
    const parsed = articleInputSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid article data" }, { status: 400 });
    }

    const data = parsed.data;

    const article = await prisma.article.update({
      where: { id },
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

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to update article", error);
    return NextResponse.json({ message: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const failure = await requireAdmin();
  if (failure instanceof NextResponse) {
    return failure;
  }

  const id = getArticleId(request);
  if (!id) {
    return NextResponse.json({ message: "Article id missing" }, { status: 400 });
  }

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article", error);
    return NextResponse.json({ message: "Failed to delete article" }, { status: 500 });
  }
}
