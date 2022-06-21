import { Container, Typography } from '@mui/material';
import { UserModel } from '@src/db/users';
import { ChangeEmailForm } from '@src/forms/change-email';
import { ChangePasswordForm } from '@src/forms/change-password';
import { User } from '@src/types';
import { getUserJWT } from '@src/validation/server-requests';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserJWT(context.req.cookies);
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  } else {
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
