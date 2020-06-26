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
  }
}

// Context Provider Value
// State (from above) is in it's own property; also included are handlers for updating state
export interface IContextValue {
  globalState: IAppContext;
  updateUserData: (value: IUserData) => void;
  toggleSideMenu: () => void;
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