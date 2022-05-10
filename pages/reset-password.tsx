import {
  Typography,
  Alert,
  Container,
  TextField,
  Toolbar,
  Button,
  CircularProgress,
} from '@mui/material';
import { Roles } from '@src/types';
import { networkRequest } from '@src/utils/network-request';
import { EmailSchema } from '@src/validation/users';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

export default function () {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mutation = useMutation(
    (email: string) =>
      networkRequest<{ email: string; roles: Roles[] }>({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: { email },
      }),
    {
      onSuccess: () => {
        setSuccess('A Reset Password email has been sent to this account!');
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
    const validationResult = EmailSchema.validate(email);
    if (validationResult.error) {
      return setError(validationResult.error.message);
    }
    mutation.mutate(email);
  }

  function reset() {
    setEmail('');
    setError('');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1">
        Password Reset
      </Typography>
      <Typography paragraph>
        Please enter your email address in the form below.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          disabled={mutation.isLoading}
          fullWidth
          type="email"
          sx={{ mb: 2 }}
          value={email}
          label="Email Address"
          onChange={(e) => setEmail(e.target.value)}
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
