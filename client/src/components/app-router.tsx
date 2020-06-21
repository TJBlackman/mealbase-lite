import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        {/* <Route path='/' exact component={HomePage} /> */}
        <Route path='/' exact component={LoginPage} />
        <Route path='/login' component={LoginPage} />
        <Redirect from='/' to='/' />
      </Switch>
    </Router>
  );
};
