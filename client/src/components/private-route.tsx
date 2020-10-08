import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useUserContext } from '../context/user';

export const PrivateRoute = ({ component, role = undefined, ...rest }) => {
  const { user } = useUserContext();
  const history = useHistory();
  if (!user._id) {
    return <Redirect to='/login' />;
  }
  if (role) {
    if (!user.roles.includes(role)) {
      alert('Unauthorized.');
      return <div>hi</div>;
    }
  }

  return <Route component={component} {...rest} />;
};
