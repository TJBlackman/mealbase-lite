import React, { useReducer, useEffect } from 'react';
import { IGenericAction } from '../../types';
import { getNewState } from '../../utils/copy-state';
import { useUserContext } from '../user';
import { useCookbookContext } from '../cookbooks';
import { networkRequest } from '../../utils/network-request';

interface IState {
  gotInitialCookbooks: boolean;
}

const defaultState: IState = {
  gotInitialCookbooks: false,
};

type IActions = IGenericAction<'GOT COOKBOOKS'>;

const reducer = (state: IState, action: IActions): IState => {
  const newState = getNewState<IState>(state);
  switch (action.type) {
    case 'GOT COOKBOOKS': {
      newState.gotInitialCookbooks = true;
      return newState;
    }
    default: {
      console.error('Unknown action type:\n' + JSON.stringify(action, null, 4));
      return state;
    }
  }
};

export const ContextMiddleware = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { user } = useUserContext();
  const { addManyCookbooks } = useCookbookContext();

  useEffect(() => {
    if (!state.gotInitialCookbooks && user.email) {
      console.log(69);
      // if user is logged in but we have not yet got a list of cookbooks, get them!
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
