import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Divider } from '@material-ui/core';
import { useUserContext } from '../context/user';
import { makeStyles } from '@material-ui/core/styles';
import { AccountRequiredWarning } from '../components/account-required-warning';

export const MealPlansPage = () => {
  const { user } = useUserContext();
  const { link } = useStyles();

  return (
    <Layout>
      <Typography variant='h2'>MealPlans Page</Typography>
      <Typography variant='body1'>
        A mealplan is short collection of recipes, and can be used to create a shopping list and plan out recipes for
        the immediate future.
      </Typography>
      <Divider style={{ margin: '30px 0' }} />
      {!user.email && <AccountRequiredWarning text='before you creating your first mealplan.' />}
    </Layout>
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
