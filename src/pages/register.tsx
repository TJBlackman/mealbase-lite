import {
  Typography,
  Box,
  Container,
  TextField,
  Toolbar,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { networkRequest } from '@src/utils/network-request';
import { registerUserSchema } from '@src/validation/schemas/users';
import { useUserContext } from '@src/contexts/user';
import { Roles } from '@src/db/users';

export default function RegisterPage() {
  const userContext = useUserContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [pwMismatch, setPwMismatch] = useState(false);

  const mutation = useMutation((payload: { email: string; password: string }) =>
    networkRequest<{ email: string; roles: Roles[] }>({
      url: '/api/users/register-account',
      method: 'POST',
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMismatch(false);
    setError('');
    if (password !== confirm) {
      return setPwMismatch(true);
    }
    const validationResult = registerUserSchema.validate({ email, password });
    if (validationResult.error) {
      return setError(validationResult.error.message);
    }
    mutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          userContext.setUser({
            email: data.email,
            roles: data.roles,
          });
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
  }

  function reset() {
    setEmail('');
    setConfirm('');
    setPassword('');
    setPwMismatch(false);
    setError('');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1">
        Register Account
      </Typography>
      <Typography paragraph>
        Please use the form below to register a new account.
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
          autoFocus
        />
        <TextField
          disabled={mutation.isLoading}
          fullWidth
          sx={{ mb: 2 }}
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          disabled={mutation.isLoading}
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          helperText={
            pwMismatch && (
              <Typography variant="body2" color="error">
                Passwords do not match!
              </Typography>
            )
          }
        />
        {error.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Toolbar disableGutters>
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <CircularProgress size={16} color="primary" />
            ) : (
              'Submit'
            )}
          </Button>
          <Button type="button" onClick={reset} disabled={mutation.isLoading}>
            Reset
          </Button>
        </Toolbar>
      </form>

      <Typography variant="body2">
        Aready have an account?{' '}
        <Link href="/login" passHref>
          <MuiLink sx={{ textDecoration: 'underline' }}>Sign In</MuiLink>
        </Link>
      </Typography>
    </Container>
  );
}
