import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { AccountPage } from '../pages/account.page';
import { BrowsePage } from '../pages/browse-recipes.page';
import { MealPlansPage } from '../pages/mealplans.page';
import { AddRecipePage } from '../pages/add-recipe.page';
import { CookbooksPage } from '../pages/cookbooks.page';
import { AboutPage } from '../pages/about.page';
import { PrivateRoute } from '../components/private-route';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegisterPage} />
        <Route path='/browse' component={BrowsePage} />
        <Route path='/mealplans' component={MealPlansPage} />
        <Route path='/cookbooks' component={CookbooksPage} />
        <Route path='/add-recipe' component={AddRecipePage} />
        <Route path='/about' component={AboutPage} />
        <PrivateRoute path='/account' component={AccountPage} />
        <Redirect from='/' to='/browse' />
      </Switch>
    </Router>
  );
};
