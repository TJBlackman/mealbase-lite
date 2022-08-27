import {
  Typography,
  Alert,
  Container,
  TextField,
  Toolbar,
  Button,
  CircularProgress,
} from '@mui/material';
import { Roles } from '@src/db/users';
import { networkRequest } from '@src/utils/network-request';
import { EmailSchema } from '@src/validation/schemas/users';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

export function getServerSideProps() {
  return { props: {} };
}

export default function ResetPwPage() {
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mutation = useMutation(
    (email: string) =>
      networkRequest<{ email: string; roles: Roles[] }>({
        url: '/api/auth/reset-password/confirm',
        method: 'POST',
        body: { email },
      }),
    {
      onSuccess: () => {
        setSuccess(
          'Your password has been updated! You may now login using your new password.'
        );
      },
      onError: (err) => {
        let msg = 'An unknown error occurred.';
        if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      },
    }
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationResult = EmailSchema.validate(password);
    if (validationResult.error) {
      return setError(validationResult.error.message);
    }
    mutation.mutate(password);
  }

  function reset() {
    setPassword('');
    setError('');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1">
        Password Reset
      </Typography>
      <Typography paragraph>
        Please enter your new password into the fields below.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          disabled={mutation.isLoading}
          fullWidth
          type="password"
          sx={{ mb: 2 }}
          value={password}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          disabled={mutation.isLoading}
          fullWidth
          type="password"
          sx={{ mb: 2 }}
          value={confirmPw}
          label="Confirm Password"
          onChange={(e) => setConfirmPw(e.target.value)}
        />
        {error.length > 0 && <Alert severity="error">{error}</Alert>}
        <Toolbar disableGutters>
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              'Submit'
            )}
          </Button>
          <Button type="button" onClick={reset} disabled={mutation.isLoading}>
            Reset
          </Button>
        </Toolbar>
        {success.length > 0 && <Alert severity="success">{success}</Alert>}
      </form>
    </Container>
  );
}
