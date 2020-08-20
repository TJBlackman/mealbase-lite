import { IGenericAction, IRecipe } from "../../types"


// register reducer actions; <type, payload>
export type ModalAction =
  IGenericAction<'SHOW MODAL', ModalContent> |
  IGenericAction<'DISMISS MODAL'>;

type GenericModalContent<T, D = undefined> = {
  modalType: T,
  modalData?: D
}

// register modal types; <type, data>
type ModalContent =
  GenericModalContent<'', null> |
  GenericModalContent<'DELETE RECIPE', IRecipe> |
  GenericModalContent<'DISMISS MODAL'> |
  GenericModalContent<'NEW COOKBOOK'> |
  GenericModalContent<'COMING SOON'>;

// modal context
export interface IModalContext {
  visible: boolean;
  content: ModalContent;
  showModal: (x: ModalContent) => void;
  dismissModal: () => void;
}