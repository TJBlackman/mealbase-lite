import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { DashboardPage } from '../pages/dashboard.page';
import { PrivateRoute } from '../components/private-route';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        {/* <Route path='/' exact component={HomePage} /> */}
        <Route path='/' exact component={RegisterPage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegisterPage} />
        <PrivateRoute path='/dashboard' component={DashboardPage} />
        <Redirect from='/' to='/' />
      </Switch>
    </Router>
  );
};
