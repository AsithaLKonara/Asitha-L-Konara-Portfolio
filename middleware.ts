import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const ADMIN_PATH_PATTERN = [/^\/admin(\/.*)?$/, /^\/api\/admin(\/.*)?$/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isProtected = ADMIN_PATH_PATTERN.some((regex) => regex.test(pathname));

  if (isProtected) {
    const payload = token ? await verifyAuthToken(token) : null;

    if (!payload) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    const headers = new Headers(request.headers);
    headers.set("x-admin-id", payload.sub ?? "");

    return NextResponse.next({ request: { headers } });
  }

  if (pathname === "/login" && token) {
    const payload = await verifyAuthToken(token);

    if (payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
