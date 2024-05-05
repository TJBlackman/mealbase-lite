import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserJWT } from "./validation/server-requests";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = new URL(request.url);
  const user = await getUserJWT(request.cookies);

  // protect user routes
  if (url.pathname.startsWith("/app")) {
    if (!user) {
      const _url = request.nextUrl.clone();
      _url.pathname = "/login";
      return NextResponse.redirect(_url, 307);
    }
  }

  // protect admin routes
  if (url.pathname.startsWith("/admin")) {
    const isAdmin = user?.roles.includes("Admin");
    if (!isAdmin) {
      const _url = request.nextUrl.clone();
      _url.pathname = !!user ? "/recipes" : "/login";
      return NextResponse.redirect(_url, 307);
    }
  }

  return response;
}
