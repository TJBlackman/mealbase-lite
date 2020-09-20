// User information
export interface IUserData {
  _id: string;
  email: string;
  roles: string[];
}

// modal types
export enum ModalTypes {
  DELETE_RECIPE,
  CLEAR_MODAL,
  COMING_SOON
}

// modal state
export interface IModalState {
  visible: boolean;
  type: ModalTypes | '';
  data: any;
}

// Application State
// Data ONLY, no handlers. This can be serialized and saved between sessions if needed
export interface IAppContext {
  user: IUserData;
  sidemenu: {
    visible: boolean;
  };
  recipes: IGlobalRecipesState;
  modal: IModalState;
}

// https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
// need to do partial updates on nested GlobalState properties
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// Context Provider Value
// State (from above) is in it's own property; also included are handlers for updating state
export interface IContextValue {
  globalState: IAppContext;
  updateUserData: (payload: Partial<IUserData>) => void;
  toggleSideMenu: () => void;
  logout: () => void;
  updateRecipesState: (payload: RecursivePartial<IGlobalRecipesState>) => void;
  replaceRecipe: (payload: IRecipe) => void;
  setModal: (payload: Partial<IModalState>) => void;
  setDisplayType: (payload: keyof typeof RecipeDisplayTypes) => void
}

// network response from server
export interface INetworkResponse {
  success: boolean;
  message: string;
  data?: any;
}

// network request
export interface INetworkRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: object;
  body?: object;
  before?: () => void;
  success?: (json: INetworkResponse) => void;
  error?: (error: INetworkResponse) => void;
  after?: () => void;
  latency?: number;
}

// recipe from DB
export interface IRecipe {
  createdAt: string;
  description: string;
  image: string;
  siteName: string;
  title: string;
  updatedAt: string;
  url: string;
  __v: number;
  _id: string;
  likes: number;
  isLiked: boolean;
}

// generic reducer action
export interface IGenericAction<T, P = undefined> {
  type: T;
  payload?: P;
};
// generic action
export interface IAction {
  type: string | number;
  payload?: any;
}

export type RecipeSortOptions = '' | 'newest' | 'oldest' | 'most liked';
export type RecipeFilterOptions = '' | 'liked recipes';
// filter recipes on browse page
export interface IRecipeFilters {
  search: string;
  filter: RecipeFilterOptions;
  sort: RecipeSortOptions;
  limit: number;
  page: number;
  cookbook: string;
}

// browse recipes page
export interface IGlobalRecipesState {
  loading: boolean;
  totalCount: number;
  browse: IRecipe[];
  filters: IRecipeFilters;
  displayType: keyof typeof RecipeDisplayTypes;
}

// recipe dispay types
enum RecipeDisplayTypes {
  cards = 'cards',
  list = 'list',
  dense = 'dense'
}

// Cookbook Record 
export interface ICookbookRecord {
  title: string;
  description?: string;
  owner: string;
  sharedWith: string[];
  recipes: string[];
  _id: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}