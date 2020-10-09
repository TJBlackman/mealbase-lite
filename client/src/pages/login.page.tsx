import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts/app-layout';
import { Typography, Grid, Button } from '@material-ui/core';
import { LoginForm } from '../forms/user-login.form';

export const LoginPage = () => {
  const history = useHistory();
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Login Page!</Typography>
          <Typography variant='body2'>Use the form below to login.</Typography>
          <LoginForm onSuccess={() => history.push('/browse')} />
          <Button
            variant='text'
            onClick={() => history.push('/request-reset-password')}
            style={{ marginLeft: 'auto', display: 'block' }}
          >
            I Forgot My Password
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};
