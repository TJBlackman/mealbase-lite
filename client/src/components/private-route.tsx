import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from '../context/user';

export const PrivateRoute = ({ component, ...rest }) => {
  const { user } = useUserContext();
  if (!user._id) {
    return <Redirect to='/login' />;
  }
  return <Route component={component} {...rest} />;
};
