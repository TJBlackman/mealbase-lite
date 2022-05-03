import {
  Typography,
  Box,
  Container,
  TextField,
  Toolbar,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { useMutation } from "react-query";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation((payload: { email: string; password: string }) =>
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(payload),
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      return alert("Passwords do not match.");
    }
    mutation.mutate({
      email,
      password,
    });
  }

  return (
    <Box mt={4}>
      <Container maxWidth="sm">
        <Typography variant="h5" component="h1">
          Register Account
        </Typography>
        <Typography paragraph>
          Please use the form below to register a new account.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            sx={{ mb: 2 }}
            value={email}
            label="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            sx={{ mb: 2 }}
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Toolbar disableGutters>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Submit
            </Button>
            <Button type="button">Reset</Button>
          </Toolbar>
        </form>

        <Typography variant="body2">
          Aready have an account?{" "}
          <Link href="/login" passHref>
            <MuiLink sx={{ textDecoration: "underline" }}>Sign In!</MuiLink>
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
