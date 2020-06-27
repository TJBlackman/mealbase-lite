import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { AccountPage } from '../pages/account.page';
import { BrowsePage } from '../pages/browse-recipes.page';
import { MealPlansPage } from '../pages/mealplans.page';
import { AddRecipePage } from '../pages/add-recipe.page';
import { AboutPage } from '../pages/about.page';
import { PrivateRoute } from '../components/private-route';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegisterPage} />
        <PrivateRoute path='/account' component={AccountPage} />
        <Route path='/browse' component={BrowsePage} />
        <Route path='/mealplan' component={MealPlansPage} />
        <Route path='/add-recipe' component={AddRecipePage} />
        <Route path='/about' component={AboutPage} />
        <Redirect from='/' to='/about' />
      </Switch>
    </Router>
  );
};
