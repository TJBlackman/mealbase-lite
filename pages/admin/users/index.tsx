import { Typography } from '@mui/material';
import { UserModel } from '@src/db/users';
import { User } from '@src/types';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const users = await UserModel.find({}).select(
      'email lastActiveDate deleted'
    );

    return { props: { users: JSON.parse(JSON.stringify(users)) } };
  } catch (err) {
    let msg = 'An unknown error has occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return {
      props: { users: [], error: msg },
    };
  }
};

type Props = {
  users: (User & { _id: string })[];
  error?: string;
};

export default function AdminUsersPage(props: Props) {
  if (props.error) {
    return <Typography variant="body1">Error: {props.error}</Typography>;
  }
  return (
    <>
      {props.users.map((u) => (
        <Typography variant="body2" key={u._id}>
          {u.email}, {u.lastActiveDate}, {u.deleted ? 'true' : 'false'}
        </Typography>
      ))}
    </>
  );
}
