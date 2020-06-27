import React, { RefAttributes } from 'react';
import Header from '../components/header';
import { Container } from '@material-ui/core';
import { SideMenu } from '../components/side-menu';

function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <SideMenu />
      <Container style={{ marginTop: '40px' }}>{children}</Container>
    </div>
  );
}

export default AppLayout;
