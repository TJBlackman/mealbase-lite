import { IGenericAction, ICookbookRecord } from '../../types';

// context default value
export interface ICookbookContext {
  cookbooks: ICookbookRecord[];
  addCookbook: (x: ICookbookRecord) => void;
  updateCookbook: (x: ICookbookRecord) => void;
  removeCookbook: (x: { cookbookId: string }) => void;
  addManyCookbooks: (x: ICookbookRecord[]) => void;
}

// cookbook reducer actions
export type CookbookAction =
  | IGenericAction<'ADD COOKBOOK', ICookbookRecord>
  | IGenericAction<'UPDATE COOKBOOK', ICookbookRecord>
  | IGenericAction<'REMOVE COOKBOOK', { cookbookId: string }>
  | IGenericAction<'ADD MANY COOKBOOKS', ICookbookRecord[]>;
