import { UserModel } from '@src/db/users';
import { User, UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if user is logged in,
  // get their liked recipe and check if any of the above recipes are liked this user
  const accessToken =
    context.req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  const user = await verifyJwt<UserJwt>(accessToken).catch((_err) => {});
  if (user) {
    const userRecord = await UserModel.findById(user._id).lean();
    if (userRecord !== null) {
      const { password, ...webSafeValues } = userRecord;
      return {
        props: {
          user: {
            ...webSafeValues,
            _id: webSafeValues._id.toString(),
            createdAt: webSafeValues.createdAt.toISOString(),
            updatedAt: webSafeValues.updatedAt.toISOString(),
            lastActiveDate: webSafeValues.lastActiveDate.toISOString(),
          },
        },
      };
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
  };
}

type Props = {
  user?: Omit<User, 'password'>;
};

export default function AccountPage(props: Props) {
  return <p>account page</p>;
}
