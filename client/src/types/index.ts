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