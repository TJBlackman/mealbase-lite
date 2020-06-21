import React, { RefAttributes } from 'react';
import Header from '../components/header';
import { Container } from '@material-ui/core';

function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  );
}

export default AppLayout;
