import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Grid, Button } from '@material-ui/core';
import { ConfirmResetPassword } from '../forms/password-reset-confirm.form';

export const ConfirmResetPasswordPage = () => {
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Password Reset</Typography>
          <Typography variant='body2'>Complete the form below to reset your password!</Typography>
          <ConfirmResetPassword />
        </Grid>
      </Grid>
    </Layout>
  );
};
