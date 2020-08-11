import { ISideMenuContext, SideMenuAction } from "./types";
import { getNewState } from "../../utils/copy-state";

export const reducer = (state: ISideMenuContext, action: SideMenuAction): ISideMenuContext => {
  const newState = getNewState(state);
  switch (action.type) {
    case 'SHOW MENU': {
      newState.visible = true;
      return newState;
    }
    case 'HIDE MENU': {
      newState.visible = false;
      return newState;
    }
    case 'TOGGLE MENU': {
      newState.visible = !newState.visible;
      return newState;
    }
    default: {
      console.error(`Unknown SideMenu action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
}