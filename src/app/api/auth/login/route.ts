import { NextResponse } from "next/server";

import { createAuthCookie, signAuthToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const raw = await request.text();

    if (!raw) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signAuthToken({ sub: admin.id, email: admin.email });
    const response = NextResponse.json({ message: "Logged in" });

    response.cookies.set(createAuthCookie(token));

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Unable to login" }, { status: 500 });
  }
}
