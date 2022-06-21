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

export function DeleteFailedRecipeEdit(props: Props) {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  // query record info
  const query = useQuery(["failed recipe", props.id], () =>
    networkRequest<{ resolved: boolean }>({
      url: `/api/admin/failed-recipes/${props.id}`,
    })
  );

  const mutation = useMutation(() =>
    networkRequest({
      url: `/api/admin/failed-recipes/${props.id}`,
      method: "DELETE",
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        props.onSuccess?.();
      },
      onError: (err) => {
        console.log("err", err);
        setError((err as Error).message);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={query.isLoading}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            color="error"
          />
        }
        label={<Typography color="error">Delete this record.</Typography>}
      />
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        sx={{ mr: 2 }}
        disabled={mutation.isLoading || !checked || query.isLoading}
      >
        {mutation.isLoading ? (
          <CircularProgress size={20} color="primary" />
        ) : (
          "Delete"
        )}
      </Button>
    </form>
  );
}
