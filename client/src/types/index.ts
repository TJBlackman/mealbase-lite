// User information
export interface IUserData {
  _id: string;
  email: string;
  roles: string[];
}

// Application State
// Data ONLY, no handlers. This can be serialized and saved between sessions if needed
export interface IAppContext {
  user: IUserData;
  sidemenu: {
    visible: boolean;
  };
  browse: IBrowseRecipePage;
}

// Context Provider Value
// State (from above) is in it's own property; also included are handlers for updating state
export interface IContextValue {
  globalState: IAppContext;
  updateUserData: (payload: Partial<IUserData>) => void;
  toggleSideMenu: () => void;
  logout: () => void;
  updateBrowseFilter: (payload: Partial<IFilterRecipesState>) => void;
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
}

// generic reducer action
export interface IGenericAction<T, P> {
  type: T;
  payload?: P;
};
// generic action
export interface IAction {
  type: string | number;
  payload?: any;
}
// filter recipes on browse page
export interface IFilterRecipesState {
  search: string;
  filter: 'all' | 'liked' | 'not liked';
  sort: 'newest' | 'oldest' | 'most likes' | 'fewest likes';
  limit: number;
  page: number;
  loading: boolean;
}

// browse recipes page
export interface IBrowseRecipePage {
  recipes: IRecipe[];
  filters: IFilterRecipesState;
}
