import React from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
  success: string;
  error: string;
  clearError: () => void;
}

// show success or error messages on forms
export const FormFeedback = ({ success, error, clearError }: IProps) => {
  const { alertClass } = useStyles();

  if (!success && !error) {
    return null;
  }

  return (
    <Alert
      className={alertClass}
      elevation={2}
      severity={error ? 'error' : 'success'}
      onClose={error ? clearError : null}
    >
      {error || success}
    </Alert>
  );
};

// styles
const useStyles = makeStyles({
  alertClass: {
    flex: '1 1 100%',
    marginBottom: '20px',
  },
});
