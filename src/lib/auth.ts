// src/lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JwtPayload {
  id: string;
  email: string;
}

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export function getSessionUser(): JwtPayload | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure:   process.env.COOKIE_SECURE === "true",
    sameSite: (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
    maxAge:   7 * 24 * 60 * 60,
    path:     "/",
  });
}

export function requireAuth(req: NextRequest): JwtPayload | NextResponse {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return user;
}
