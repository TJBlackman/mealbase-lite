import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { networkRequest } from "@src/utils/network-request";
import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { editDomainHashSchema } from "@src/validation/schemas/domain-hashes";

type Props = {
  domainHashId: string;
  onSuccess?: () => void;
};

export function EditDomainHashForm(props: Props) {
  const [error, setError] = useState("");
  const [domain, setDomain] = useState("");
  const [isDynamic, setDynamic] = useState(false);
  const [selector, setSelector] = useState("");

  const query = useQuery(["domain hash", props.domainHashId], () =>
    networkRequest<{ domain: string; selector: string; isDynamic: boolean }>({
      url: `/api/admin/domain-hashes/${props.domainHashId}`,
    })
  );

  // set form values after retrieving record
  useEffect(() => {
    if (query.isSuccess) {
      setDomain(query.data.domain);
      setSelector(query.data.selector);
      setDynamic(query.data.isDynamic || false);
    }
  }, [query.dataUpdatedAt]);

  const mutation = useMutation(
    (payload: { domain: string; selector: string; isDynamic: boolean }) =>
      networkRequest<{ email: string }>({
        url: `/api/admin/domain-hashes/${props.domainHashId}`,
        method: "PUT",
        body: payload,
      })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const payload = { domain, selector, isDynamic };
    const validationResult = editDomainHashSchema.validate(payload);
    if (validationResult.error) {
      setError(validationResult.error.message);
    }
    mutation.mutate(payload, {
      onSuccess: (data) => {
        props.onSuccess?.();
      },
    });
  }

  if (query.isLoading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1" paragraph>
        Update the domain and hash selector.
      </Typography>
      <TextField
        fullWidth
        label="Domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        disabled={mutation.isLoading}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Selector"
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
        disabled={mutation.isLoading}
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isDynamic}
            onChange={(e) => setDynamic(e.target.checked)}
          />
        }
        label="Selector is Dynamic"
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
      </Toolbar>
    </form>
  );
}
