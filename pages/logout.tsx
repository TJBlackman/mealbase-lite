import { GetServerSideProps } from "next";
import cookie from "cookie";

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Set-Cookie", [
    cookie.serialize(
      process.env.ACCESS_TOKEN_COOKIE_NAME!,
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 0,
      }
    ),
    cookie.serialize(
      process.env.REFRESH_TOKEN_COOKIE_NAME!,
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        path: "/",
      }
    ),
  ]);

  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
};

export default () => <p>Logout.</p>;
