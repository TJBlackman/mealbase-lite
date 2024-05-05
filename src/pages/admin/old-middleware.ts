import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { getUserJWT } from "@src/validation/server-requests";

// only allow logged-in admins to access /admin/* routes
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const user = await getUserJWT(req.cookies);
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url, 307);
  }
  if (user.roles.includes("Admin")) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/recipes";
  return NextResponse.redirect(url, 307);
}
