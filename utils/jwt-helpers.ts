import { SignJWT, jwtVerify } from "jose";

// create key object from JWT secret
const JWT_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

// create a JWT
export async function createJwt(options: {
  payload: Record<string, any>;
  type: "access-token" | "refresh-token" | "reset-pw-token";
}) {
  const jwt = await new SignJWT(options.payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER!)
    .setExpirationTime(
      (() => {
        switch (options.type) {
          case "refresh-token": {
            return process.env.REFRESH_TOKEN_JWT_EXPIRE!;
          }
          case "access-token": {
            return process.env.NEXT_PUBLIC_ACCESS_TOKEN_JWT_EXPIRE!;
          }
          case "reset-pw-token": {
            return process.env.RESET_PW_JWT_EXPIRE!;
          }
          default: {
            throw Error(`Unknown JWT type: "${options.type}"`);
          }
        }
      })()
    )
    .sign(JWT_KEY);
  return jwt;
}

// verify a JWT is valid (signed, not expired)
export async function verifyJwt<T>(str: string) {
  const payload = await jwtVerify(str, JWT_KEY);
  return payload.payload as unknown as T;
}
