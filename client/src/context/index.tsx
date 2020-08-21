import React from 'react';

import { CookbookContextProvider } from './cookbooks';
import { ModalContextProvider } from './modal';
import { RecipeContextProvider } from './recipes';
import { SideMenuContextProvider } from './side-menu';
import { UserContextProvider } from './user';

export const GlobalContextProvider = ({ children }) => {
  return (
    <CookbookContextProvider>
      <ModalContextProvider>
        <RecipeContextProvider>
          <SideMenuContextProvider>
            <UserContextProvider>{children}</UserContextProvider>
          </SideMenuContextProvider>
        </RecipeContextProvider>
      </ModalContextProvider>
    </CookbookContextProvider>
  );
};
