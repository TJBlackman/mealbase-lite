import { FormEvent, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { networkRequest } from "@src/utils/network-request";
import {
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";

type Props = {
  id: string;
  onSuccess?: () => void;
};

export function EditFailedRecipeEdit(props: Props) {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  // query record info
  const query = useQuery(["failed recipe", props.id], () =>
    networkRequest<{ resolved: boolean; url: string }>({
      url: `/api/admin/failed-recipes/${props.id}`,
    })
  );

  useEffect(() => {
    if (query.isSuccess) {
      setChecked(query.data.resolved);
    }
  }, [query.dataUpdatedAt]);

  const mutation = useMutation(
    (payload: { resolved: boolean }) =>
      networkRequest({
        url: `/api/admin/failed-recipes/${props.id}`,
        method: "PUT",
        body: payload,
      }),
    {
      onSuccess: (data) => {
        console.log("success.....");
        props.onSuccess?.();
      },
    }
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    mutation.mutate({ resolved: checked });
  }

  return (
    <form onSubmit={handleSubmit}>
      {query.isLoading && <Typography variant="body2">Loading...</Typography>}
      {query.isSuccess && (
        <Typography variant="body2">{query.data.url}</Typography>
      )}
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            disabled={query.isLoading}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label="Recipe has been added."
      />
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        sx={{ mr: 2 }}
        disabled={mutation.isLoading || query.isLoading}
      >
        {mutation.isLoading ? (
          <CircularProgress size={20} color="primary" />
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
