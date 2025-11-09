import bcrypt from "bcryptjs";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "portfolio_admin_token";
const TOKEN_EXPIRES_IN = "7d";

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export type AuthToken = AuthTokenPayload & JWTPayload;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(payload: AuthTokenPayload, expiresIn: string = TOKEN_EXPIRES_IN) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthToken | null> {
  try {
    const result = await jwtVerify(token, getJwtSecret());
    const { sub, email, ...rest } = result.payload;

    if (typeof sub !== "string" || typeof email !== "string") {
      return null;
    }

    return {
      sub,
      email,
      ...rest,
    };
  } catch {
    return null;
  }
}

export function createAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";

  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
