// User information
export interface IUserData {
  _id: string;
  email: string;
  roles: string[];
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

// network response from server
export interface INetworkResponse {
  success: boolean;
  message: string;
  data?: any;
}

// network request
export interface INetworkRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: object;
  body?: object;
  before?: () => void;
  success?: (json: INetworkResponse) => void;
  error?: (error: INetworkResponse) => void;
  after?: () => void;
}