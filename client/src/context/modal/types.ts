import { IGenericAction, IRecipe, ICookbookRecord } from "../../types"


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
  GenericModalContent<'ADD RECIPE TO COOKBOOK', IRecipe> |
  GenericModalContent<'REMOVE FROM COOKBOOK', { recipe: IRecipe; cookbookId: string }> |
  GenericModalContent<'DISMISS MODAL'> |
  GenericModalContent<'NEW COOKBOOK'> |
  GenericModalContent<'DELETE COOKBOOK', ICookbookRecord> |
  GenericModalContent<'EDIT COOKBOOK', ICookbookRecord> |
  GenericModalContent<'COMING SOON'>;

// modal context
export interface IModalContext {
  visible: boolean;
  content: ModalContent;
  showModal: (x: ModalContent) => void;
  dismissModal: () => void;
}