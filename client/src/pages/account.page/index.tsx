import React from 'react';
import Layout from '../../layouts/app-layout';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { EditEmailAddressForm } from '../../forms/user-edit-email.form';
import { EditPasswordForm } from '../../forms/user-edit-password';

export const AccountPage = () => {
  const location = useLocation();
  console.log(location);

  return (
    <Layout>
      <Typography variant='h2'>User Account Settings</Typography>
      <Typography variant='body1'>Edit your user settings here.</Typography>
      <br />
      <Typography variant='h5'>Edit Email Address</Typography>
      <EditEmailAddressForm />
      <br />
      <Typography variant='h5'>Edit Password</Typography>
      <EditPasswordForm />
    </Layout>
  );
};
