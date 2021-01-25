import React from 'react';

import { UserContextProvider } from './user';
import { CookbookContextProvider } from './cookbooks';
import { MealPlanContextProvider } from './mealplans';
import { ModalContextProvider } from './modal';
import { RecipeContextProvider } from './recipes';
import { SideMenuContextProvider } from './side-menu';

export const GlobalContextProvider = ({ children }) => {
  return (
    <UserContextProvider>
      <CookbookContextProvider>
        <MealPlanContextProvider>
          <ModalContextProvider>
            <RecipeContextProvider>
              <SideMenuContextProvider>{children}</SideMenuContextProvider>
            </RecipeContextProvider>
          </ModalContextProvider>
        </MealPlanContextProvider>
      </CookbookContextProvider>
    </UserContextProvider>
  );
};
