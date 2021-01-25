import { IGenericAction, ICookbookRecord } from '../../types';

type RecipeAndCookbook = {
  recipeId: string;
  cookbookId: string;
};

// context default value
export interface ICookbookContext {
  cookbooks: ICookbookRecord[];
  addCookbook: (cookbook: ICookbookRecord) => void;
  updateCookbook: (cookbook: ICookbookRecord) => void;
  removeCookbook: (cookbookId: ICookbookRecord) => void;
  addManyCookbooks: (cookbooks: ICookbookRecord[]) => void;
  addRecipeToCookbook: (arg: RecipeAndCookbook) => void;
}

// cookbook reducer actions
export type CookbookAction =
  | IGenericAction<'ADD COOKBOOK', ICookbookRecord>
  | IGenericAction<'UPDATE COOKBOOK', ICookbookRecord>
  | IGenericAction<'REMOVE COOKBOOK', ICookbookRecord>
  | IGenericAction<'ADD RECIPE TO COOKBOOK', RecipeAndCookbook>
  | IGenericAction<'ADD MANY COOKBOOKS', ICookbookRecord[]>;
