// src/lib/auth.ts
// Auth utilities for Next.js API route handlers.
// These replace the Express middleware/auth.js file entirely.
// Instead of middleware chaining (router.use(authenticate, authorize(...))),
// we call these functions directly at the top of each route handler.

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

// ── Read & verify token from the request cookie ───────────────────────────────
// Used in API route handlers (has access to the request object).
export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Read token from the Next.js cookie store ──────────────────────────────────
// Used in Server Components and Server Actions where you don't have a request object.
export function getSessionUser(): JwtPayload | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Sign a new token ──────────────────────────────────────────────────────────
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ── Attach auth cookie to a NextResponse ──────────────────────────────────────
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("token", token, {
    httpOnly:  true,
    secure:    process.env.COOKIE_SECURE === "true",
    sameSite:  (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
    maxAge:    7 * 24 * 60 * 60, // 7 days in seconds
    path:      "/",
  });
}

// ── Guard helpers — call these at the top of protected route handlers ─────────
// Returns the user if authenticated, or a 401 NextResponse to return immediately.
// Usage:
//   const result = requireAuth(req);
//   if (result instanceof NextResponse) return result;
//   const user = result; // typed as JwtPayload

export function requireAuth(req: NextRequest): JwtPayload | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return user;
}

export function requireRole(
  req: NextRequest,
  ...roles: UserRole[]
): JwtPayload | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!roles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}
