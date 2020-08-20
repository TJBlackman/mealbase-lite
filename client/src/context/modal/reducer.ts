import { IModalContext, ModalAction } from "./types";
import { getNewState } from "../../utils/copy-state";

export const reducer = (state: IModalContext, action: ModalAction): IModalContext => {
  const newState = getNewState(state);
  switch (action.type) {
    case 'SHOW MODAL': {
      newState.visible = true;
      newState.content = action.payload;
      return newState;
    }
    case 'DISMISS MODAL': {
      newState.visible = false;
      return newState;
    }
    default: {
      console.error(`Unknown SideMenu action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
}