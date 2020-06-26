import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../context';

export const PrivateRoute = ({ component, ...rest }) => {
  const { globalState } = useContext(AppContext);
  if (!globalState.user._id) {
    return <Redirect to='/login' />;
  }
  return <Route component={component} {...rest} />;
};
