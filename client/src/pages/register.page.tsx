import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';
import { RegisterForm } from '../forms/user-register.form';

export const RegisterPage = () => {
  const history = useHistory();
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Register a new account!</Typography>
          <Typography variant='body2'>Use the form below to register a new account.</Typography>
          <RegisterForm onSuccess={() => history.push('/browse')} />
        </Grid>
      </Grid>
    </Layout>
  );
};
