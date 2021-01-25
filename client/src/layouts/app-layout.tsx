import React from 'react';
import { Container } from '@material-ui/core';
import Header from '../components/header';
import { SideMenu } from '../components/side-menu';

function AppLayout(props) {
  return (
    <>
      <Header />
      <SideMenu />
      <Container style={{ margin: '40px auto 100px auto' }}>{props.children}</Container>
    </>
  );
}

export default AppLayout;
