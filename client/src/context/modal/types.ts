import { IGenericAction } from "../../types";

// register reducer actions; <type, payload>
export type ModalAction =
  IGenericAction<'SHOW MENU'> |
  IGenericAction<'HIDE MENU'> |
  IGenericAction<'TOGGLE MENU'>;

type GenericModalContent<T, D = undefined> = {
  type: T,
  data: D
}

// register modal types; <type, data>
type ModalContent =
  GenericModalContent<'', null> |
  GenericModalContent<'DELETE RECIPE', { recipeId: string }> |
  GenericModalContent<'HIDE MODAL'> |
  GenericModalContent<'COMING SOON'>;

// modal context
export interface IModalContext {
  visible: boolean;
  content: ModalContent;
  showMenu: () => void;
  hideMenu: () => void;
  toggleMenu: () => void;
}