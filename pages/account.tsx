import { Container, Typography } from '@mui/material';
import { UserModel } from '@src/db/users';
import { ChangeEmailForm } from '@src/forms/change-email';
import { ChangePasswordForm } from '@src/forms/change-password';
import { User, UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers2';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if user does not have a valid access token, redirect them to /login
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
  user: Omit<User, 'password'>;
};

export default function AccountPage(props: Props) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" paragraph>
        Account Settings
      </Typography>
      <br />
      <ChangeEmailForm email={props.user.email} />
      <br />
      <ChangePasswordForm />
    </Container>
  );
}
