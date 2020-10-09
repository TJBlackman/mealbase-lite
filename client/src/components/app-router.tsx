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
import { EditRecipePage } from '../pages/edit-recipe.page';
import { RequestResetPasswordPage } from '../pages/password-reset-request.page';
import { ConfirmResetPasswordPage } from '../pages/password-reset-confirm.page';

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
        <Route path='/edit-recipe/:recipeId' component={EditRecipePage} />
        <Route path='/request-reset-password' component={RequestResetPasswordPage} />
        <Route path='/confirm-reset-password/:jwt' component={ConfirmResetPasswordPage} />
        <PrivateRoute path='/account' component={AccountPage} />
        <Redirect from='/' to='/browse' />
      </Switch>
    </Router>
  );
};
