import { UserJwt } from "@src/types";
import { verifyJwt } from "@src/utils/jwt-helpers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Check req.cookies for Access Token, and get user JWT from it
 * @param cookies req.cookie
 * @returns UserJWT | null
 */
export async function getUserJWT(
  cookies: RequestCookies | Partial<{ [key: string]: string }>
): Promise<UserJwt | null> {
  // validate request is from a logged in user
  // const accessToken = cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
  let accessToken = "";
  if (cookies instanceof RequestCookies) {
    const token = cookies.get(process.env.ACCESS_TOKEN_COOKIE_NAME!);
    if (token) {
      accessToken = token.value;
    }
  } else {
    const token = cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
    if (token) {
      accessToken = token;
    }
  }
  if (!accessToken) {
    return null;
  }
  const user = await verifyJwt<UserJwt>(accessToken).catch((err) => {
    console.log("Unable to verify Access Token JWT.");
    console.log(err);
  });
  if (user) {
    return user;
  }
  return null;
}
