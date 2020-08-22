import React, { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { ICookbookRecord } from '../types';

// types
interface IProps {
  cookbook: ICookbookRecord;
}

// component
export const CookbookListItem = ({ cookbook }: IProps) => {
  const { root, cardContent } = useStyles();

  return (
    <Card className={root} elevation={2}>
      <CardContent className={cardContent}>
        <Typography gutterBottom variant='h6' component='h2'>
          {cookbook.title}
        </Typography>
        <Typography variant='body2' component='p'>
          {cookbook.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

// styles
const useStyles = makeStyles((theme) => ({
  root: {
    flex: '0 0 100%',
    margin: '10px 0px',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'flex-start',
    position: 'relative',
    '&:hover': {
      boxShadow: theme.shadows[10],
    },
  },
  cardContent: {
    padding: '5px 5px 5px 20px',
    paddingBottom: '5px !important',
    flex: '1 1 100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
  },
}));
