import {
  Typography,
  Alert,
  Container,
  TextField,
  Toolbar,
  Button,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { useUserContext } from "@src/contexts/user";
import { Roles } from "@src/types";
import { networkRequest } from "@src/utils/network-request";
import { localLoginSchema } from "@src/validation/users";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const userContext = useUserContext();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation(
    (payload: { email: string; password: string }) =>
      networkRequest<{ email: string; roles: Roles[] }>({
        url: "/api/auth/login/local",
        method: "POST",
        body: payload,
      }),
    {
      onSuccess: (data) => {
        router.push("/browse");
        userContext.setUser({
          email: data.email,
          roles: data.roles,
        });
      },
      onError: (err) => {
        let msg = "An unknown error occurred.";
        if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      },
    }
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const validationResult = localLoginSchema.validate({ email, password });
    if (validationResult.error) {
      return setError(validationResult.error.message);
    }
    mutation.mutate({
      email,
      password,
    });
  }

  function reset() {
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1">
        Login
      </Typography>
      <Typography paragraph>Please use the form below to log in.</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          disabled={mutation.isLoading}
          fullWidth
          autoFocus
          type="email"
          sx={{ mb: 2 }}
          value={email}
          label="Email Address"
          onChange={(e) => setEmail(e.target.value)}
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
              "Submit"
            )}
          </Button>
          <Button type="button" onClick={reset} disabled={mutation.isLoading}>
            Reset
          </Button>
        </Toolbar>
      </form>

      <Typography variant="body2" paragraph>
        Don&apos;t have an account?{" "}
        <Link href="/register" passHref>
          <MuiLink sx={{ textDecoration: "underline" }}>Sign Up</MuiLink>
        </Link>
      </Typography>
      <Typography variant="body2">
        <Link href="/reset-password" passHref>
          <MuiLink sx={{ textDecoration: "underline" }}>
            I forgot my password!
          </MuiLink>
        </Link>
      </Typography>
    </Container>
  );
}
