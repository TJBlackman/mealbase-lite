import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { getUserJWT } from '@src/validation/server-requests';

// only allow logged-in users to access /app/* routes
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const user = await getUserJWT(req.cookies);
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}
