import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const AboutPage = () => {
  return (
    <Layout>
      <Typography variant='h2'>About and FAQ</Typography>
      <Typography variant='body1'>Learn about this app here.</Typography>
    </Layout>
  );
};
