import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useUserContext } from '../context/user';

export const PrivateRoute = ({ component, role = undefined, ...rest }) => {
  const { user } = useUserContext();
  const history = useHistory();
  if (!user._id) {
    history.push('/login');
  }
  if (role) {
    if (!user.roles.includes(role)) {
      alert('Unauthorized.');
      history.push('/login');
    }
  }

  return <Route component={component} {...rest} />;
};
