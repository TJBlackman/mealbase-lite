import {
  Typography,
  Alert,
  Button,
  TextField,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { networkRequest } from "@src/utils/network-request";
import { PasswordSchema } from "@src/validation/schemas/users";
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation((payload: { password: string; newPw: string }) =>
    networkRequest({
      url: "/api/users/edit-account",
      method: "PUT",
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    // validate password
    const result1 = PasswordSchema.validate(password);
    if (result1.error) {
      return setError("Password error: " + result1.error.message);
    }
    // validate new pw
    const result2 = PasswordSchema.validate(newPw);
    if (result2.error) {
      return setError("New Password error: " + result2.error.message);
    }
    // validate confirm password
    const result3 = PasswordSchema.validate(confirmPw);
    if (result3.error) {
      return setError("Confirm New Password error: " + result3.error.message);
    }
    // validate passwords match
    if (newPw !== confirmPw) {
      return setError("Passwords do not match.");
    }
    mutation.mutate(
      {
        password,
        newPw,
      },
      {
        onSuccess: () => {
          reset();
          setSuccess("Password updated successfully!");
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
  }

  function reset() {
    setPassword("");
    setNewPw("");
    setConfirmPw("");
    setError("");
    setSuccess("");
  }

  useEffect(() => {
    if (success.length > 0) {
      const timeout = setTimeout(() => setSuccess(""), 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [success]);

  const noInput =
    password.length < 6 && newPw.length < 6 && confirmPw.length < 6;

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1" paragraph>
        Update your password:
      </Typography>
      <TextField
        fullWidth
        label="Current Password"
        sx={{ mb: 2 }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={mutation.isLoading}
      />
      <TextField
        fullWidth
        label="New Password"
        sx={{ mb: 2 }}
        type="password"
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        disabled={mutation.isLoading}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        sx={{ mb: 2 }}
        type="password"
        value={confirmPw}
        onChange={(e) => setConfirmPw(e.target.value)}
        disabled={mutation.isLoading}
      />
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
      <Toolbar disableGutters>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={mutation.isLoading || noInput}
        >
          {mutation.isLoading ? (
            <CircularProgress size={16} color="primary" />
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={reset}
          disabled={mutation.isLoading}
        >
          Reset
        </Button>
      </Toolbar>
      {success.length > 0 && <Alert severity="success">{success}</Alert>}
    </form>
  );
}
