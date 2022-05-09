import { Typography, TextField, Toolbar, Button } from '@mui/material';
import { UserModel } from '@src/db/users';
import { User, UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers';
import { networkRequest } from '@src/utils/network-request';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

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
  const [email, setEmail] = useState<string>(props.user.email);
  const [password, setPassword] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const mutation = useMutation((payload: Partial<User>) =>
    networkRequest({
      url: '/api/users',
      method: 'PUT',
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: Record<string, string> = {};
    if (email !== props.user.email) {
      payload.email = email;
    }

    mutation.mutate({
      email,
      password,
    });
  }

  function resetEmail() {
    setEmail(props.user.email);
  }

  return (
    <>
      <Typography variant="h5" component="h1">
        Account Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={email}
          label="Email Address"
          disabled={mutation.isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Toolbar>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={resetEmail}
            disabled={mutation.isLoading}
          >
            Reset
          </Button>
        </Toolbar>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={password}
          label="Password"
          disabled={mutation.isLoading}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          value={newPw}
          label="New Password"
          disabled={mutation.isLoading}
          onChange={(e) => setNewPw(e.target.value)}
        />
        <TextField
          fullWidth
          value={confirmPw}
          label="Confirm New Password"
          disabled={mutation.isLoading}
          onChange={(e) => setConfirmPw(e.target.value)}
        />
        <Toolbar>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={resetEmail}
            disabled={mutation.isLoading}
          >
            Reset
          </Button>
        </Toolbar>
      </form>
    </>
  );
}
