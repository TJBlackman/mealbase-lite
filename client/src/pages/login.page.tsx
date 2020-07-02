import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';
import { LoginForm } from '../forms/login.form';

export const LoginPage = () => {
  const history = useHistory();
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Login Page!</Typography>
          <Typography variant='body2'>Use the form below to login.</Typography>
          <LoginForm onSuccess={() => history.push('/browse')} />
        </Grid>
      </Grid>
    </Layout>
  );
};
