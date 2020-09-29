import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { CreateCSSProperties, CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProps {
  text: string;
  className?: any;
}

export const AccountRequiredWarning = ({ text = 'before doing something...', className = null }: IProps) => {
  const { link } = useStyles();
  return (
    <Alert elevation={2} severity='warning' className={className}>
      Please{' '}
      <Link to='/register' className={link}>
        create a free account
      </Link>{' '}
      {text}
    </Alert>
  );
};

const useStyles = makeStyles((theme) => ({
  link: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));
