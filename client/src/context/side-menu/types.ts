import { IGenericAction } from "../../types";

export interface ISideMenuContext {
  visible: boolean;
  showMenu: () => void;
  hideMenu: () => void;
  toggleMenu: () => void;
}

export type SideMenuAction =
  IGenericAction<'SHOW MENU'> |
  IGenericAction<'HIDE MENU'> |
  IGenericAction<'TOGGLE MENU'>;
