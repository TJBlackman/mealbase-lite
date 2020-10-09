import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Grid, Button } from '@material-ui/core';
import { RequestResetPassword } from '../forms/password-reset-request.form';

export const RequestResetPasswordPage = () => {
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Request a Password Reset</Typography>
          <Typography variant='body2'>
            Complete the form below to reset your password! You will receive an email with instructions.
          </Typography>
          <RequestResetPassword />
        </Grid>
      </Grid>
    </Layout>
  );
};
