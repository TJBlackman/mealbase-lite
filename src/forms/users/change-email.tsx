import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { networkRequest } from "@src/utils/network-request";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { EmailSchema } from "@src/validation/schemas/users";

type Props = {
  email: string;
};

export function ChangeEmailForm(props: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(props.email);
  const [error, setError] = useState("");

  const mutation = useMutation((payload: { email: string }) =>
    networkRequest<{ email: string }>({
      url: "/api/users/edit-account",
      method: "PUT",
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const validationResult = EmailSchema.validate(email);
    if (validationResult.error) {
      setError(validationResult.error.message);
    }
    mutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          router.reload();
        },
      }
    );
  }

  function reset() {
    setEmail(props.email);
    setError("");
  }

  const notChanged = email === props.email;

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1" paragraph>
        Update your email address:
      </Typography>
      <TextField
        fullWidth
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={mutation.isLoading}
        sx={{ mb: 2 }}
      />
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
      <Toolbar disableGutters>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={mutation.isLoading || notChanged}
        >
          {mutation.isLoading ? (
            <CircularProgress size={20} color="primary" />
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
    </form>
  );
}
