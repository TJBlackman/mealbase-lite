import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const AccountPage = () => {
  return (
    <Layout>
      <Typography variant='h2'>User Account Page</Typography>
      <Typography variant='body1'>Edit your user settings here.</Typography>
    </Layout>
  );
};
