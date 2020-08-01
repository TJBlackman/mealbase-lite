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
type RecursivePartial<T> = {
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
  likes: number;
  isLiked: boolean;
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
  filter: 'x' | 'liked';
  sort: 'newest' | 'oldest' | 'most liked';
  limit: number;
  page: number;
}

// browse recipes page
export interface IGlobalRecipesState {
  loading: boolean;
  totalCount: number;
  browse: IRecipe[];
  filters: IFilterRecipesState;
}
