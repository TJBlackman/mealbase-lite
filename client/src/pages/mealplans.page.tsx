import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, CircularProgress, Grid } from '@material-ui/core';

import Layout from '../layouts/app-layout';
import { useUserContext } from '../context/user';
import { useMealPlanContext } from '../context/mealplans';
import { AccountRequiredWarning } from '../components/account-required-warning';
import { networkRequest } from '../utils/network-request';

export const MealPlansPage = () => {
  const { user } = useUserContext();
  const { mealplans, loading: loadingMealplans, addManyMealPlans, loadMealPlans } = useMealPlanContext();
  const { link } = useStyles();

  useEffect(() => {
    if (mealplans.length === 0) {
      loadMealPlans();
      networkRequest({
        url: '/api/v1/mealplans?limit=50&sortBy=createdAt&sortOrder=-1',
        latency: 1000,
        success: (json) => {
          addManyMealPlans(json.data);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }, []);

  return (
    <Layout>
      <Typography variant='h2'>MealPlans Page</Typography>
      <Typography variant='body1'>
        A mealplan is short collection of recipes, and can be used to create a shopping list and plan out recipes for
        the immediate future.
      </Typography>
      <Divider style={{ margin: '30px 0' }} />
      {!user.email && <AccountRequiredWarning text='before you creating your first mealplan.' />}
      {loadingMealplans && (
        <Grid container justify='center'>
          <Grid item>
            <CircularProgress size={50} />
          </Grid>
        </Grid>
      )}
      {mealplans.length === 0 && !loadingMealplans && (
        <Grid container justify='center'>
          <Grid item>
            <Typography variant='h6'>No mealplans found!</Typography>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3}>
        {mealplans.map(({ title }) => (
          <Grid item>
            <Typography variant='body1'>{title}</Typography>
          </Grid>
        ))}
      </Grid>
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
