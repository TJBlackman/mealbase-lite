import { GetServerSideProps } from 'next';
import { RefreshTokenModel } from '@src/db/refresh-tokens';
import cookie from 'cookie';
import { verifyJwt } from '@src/utils/jwt-helpers2';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // delete refresh token record from db
  const refreshTokenJWT =
    context.req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME!];
  if (refreshTokenJWT) {
    const payload = await verifyJwt<{ _id: string }>(refreshTokenJWT).catch(
      (err) => {
        console.log(err);
      }
    );
    if (payload) {
      await RefreshTokenModel.findByIdAndDelete(payload._id).catch((err) => {
        console.log(err);
      });
    }
  }

  // set headers to remove cookies from browser
  context.res.setHeader('Set-Cookie', [
    cookie.serialize(
      process.env.ACCESS_TOKEN_COOKIE_NAME!,
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 0,
      }
    ),
    cookie.serialize(
      process.env.REFRESH_TOKEN_COOKIE_NAME!,
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        path: '/',
      }
    ),
  ]);

  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
};

export default function logout() {
  return <p>Logout.</p>;
}
