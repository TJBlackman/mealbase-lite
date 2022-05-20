import { UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers';

export async function userIsLoggedIn(cookies: Record<string, string>) {
  // validate logged in user is an ADMIN
  const accessToken = cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
  if (!accessToken) {
    return false;
  }
  const user = await verifyJwt<UserJwt>(accessToken).catch((err) => {
    console.log('Unable to verify Access Token JWT.');
    console.log(err);
  });
  return;
}

export function userIsAdmin() {}
