// User information
export interface IUserData {
  email: string;
  authenticated: boolean;
}

// App Context
export interface IAppContext {
  user?: IUserData;
}

// Context Provider Value
export interface IContextValue {
  state: IAppContext;
  updateUserData: (value: IUserData) => void;
}

// network request
export interface INetworkRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: object;
  body?: object;
  before?: () => void;
  success?: (json: object) => void;
  error?: (error: Error) => void;
  after?: () => void;
}