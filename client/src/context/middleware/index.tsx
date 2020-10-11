import React, { useReducer, useEffect } from 'react';
import { IGenericAction } from '../../types';
import { getNewState } from '../../utils/copy-state';
import { useUserContext } from '../user';
import { useCookbookContext } from '../cookbooks';
import { networkRequest } from '../../utils/network-request';
import { useHistory } from 'react-router-dom'; 

interface IState {
  gotInitialCookbooks: boolean;
  initialLoginCheck: boolean;
}

const defaultState: IState = {
  gotInitialCookbooks: false,
  initialLoginCheck: false,
};

type IActions = IGenericAction<'GOT COOKBOOKS'> | IGenericAction<'LOGIN CHECK'>;

const reducer = (state: IState, action: IActions): IState => {
  const newState = getNewState<IState>(state);
  switch (action.type) {
    case 'GOT COOKBOOKS': {
      newState.gotInitialCookbooks = true;
      return newState;
    }
    case 'LOGIN CHECK': {
      newState.initialLoginCheck = true;
      return newState;
    }
    default: {
      console.error('Unknown action type:\n' + JSON.stringify(action, null, 4));
      return state;
    }
  }
};

export const ContextMiddleware = ({ children }: React.PropsWithChildren<{}>) => {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { user, updateUserData } = useUserContext();
  const { addManyCookbooks } = useCookbookContext();

  // log user in if they have a valid cookie
  useEffect(() => {
    const isLoggedOut = user.email === '';
    if (isLoggedOut) {
      networkRequest({
        url: '/api/v1/users/my-cookie',
        success: (json) => {
          if (!json.data) {
            return;
          }
          const { _id, roles, email } = json.data;
          updateUserData({
            _id,
            roles,
            email,
          });
        },
        after: () => {
          dispatch({ type: 'LOGIN CHECK' });
        },
      });
    }
  });

  // get user's cookbooks when they login
  useEffect(() => {
    if (!state.gotInitialCookbooks && user.email) {
      networkRequest({
        url: '/api/v1/cookbooks',
        method: 'GET',
        error: (response) => {
          console.error(response.message);
        },
        success: (response) => {
          addManyCookbooks(response.data);
          dispatch({ type: 'GOT COOKBOOKS' });
        },
      });
    }
  }, [state.gotInitialCookbooks, user.email]);

  return <>{children}</>;
};
