import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserJWT } from '@src/validation/server-requests';
import { Roles } from '@src/db/users';

// only allow users with the Roles.Admin privilege to access /admin/* routes
export async function middleware(req: NextRequest) {
  const user = await getUserJWT(req.cookies);
  if (!user || user.roles.indexOf(Roles.Admin) < 0) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}