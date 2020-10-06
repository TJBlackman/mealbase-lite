import React from 'react';
import { Container } from '@material-ui/core';
import Header from '../components/header';
import { SideMenu } from '../components/side-menu';

function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <SideMenu />
      <Container style={{ margin: '40px auto 100px auto' }}>{children}</Container>
    </div>
  );
}

export default AppLayout;
