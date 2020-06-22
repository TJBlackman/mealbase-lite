import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';
import { RegisterForm } from '../forms/register.form';

export const RegisterPage = () => {
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Register Page!</Typography>
          <Typography variant='body2'>Use the form below to register a new account.</Typography>
          <RegisterForm />
        </Grid>
      </Grid>
    </Layout>
  );
};
