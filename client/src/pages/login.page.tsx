import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';
import { LoginForm } from '../forms/login.form';

export const LoginPage = () => {
  return (
    <Layout>
      <Typography variant='h4'>Login Page!</Typography>
      <Typography variant='body2'>Use the form below to login.</Typography>
      <LoginForm />
    </Layout>
  );
};
