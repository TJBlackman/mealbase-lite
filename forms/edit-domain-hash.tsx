import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { networkRequest } from '@src/utils/network-request';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { editDomainHashSchema } from '@src/validation/schemas/domain-hashes';

type Props = {
  domainHashId: string;
};

export function EditDomainHashForm(props: Props) {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('');
  const [error, setError] = useState('');

  const query = useQuery(['domain hash', props.domainHashId], () =>
    networkRequest({
      url: `/admin/domain-hashes/${props.domainHashId}`,
    })
  );

  const mutation = useMutation(
    (payload: { domain: string; selector: string }) =>
      networkRequest<{ email: string }>({
        url: '/api/users/edit-account',
        method: 'PUT',
        body: payload,
      })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const payload = { domain, selector };
    const validationResult = editDomainHashSchema.validate(payload);
    if (validationResult.error) {
      setError(validationResult.error.message);
    }
    mutation.mutate(payload, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1" paragraph>
        Update your email address:
      </Typography>
      <TextField
        fullWidth
        label="Domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        disabled={mutation.isLoading}
        sx={{ mb: 2 }}
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
      </Toolbar>
    </form>
  );
}
