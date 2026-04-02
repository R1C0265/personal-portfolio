// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  } catch { return null; }
}

export function middleware(request: NextRequest) {
  const token   = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const payload = token ? decodeJwt(token) : null;
  const expired = payload?.exp ? payload.exp * 1000 < Date.now() : true;
  const isAuthed = !!payload && !expired;

  if (pathname.startsWith("/admin")) {
    if (!isAuthed) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/auth/login" && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
