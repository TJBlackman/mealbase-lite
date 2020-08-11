import { IGenericAction, IUserData } from '../../types';

// context default value
export interface IUserContext {
  user: IUserData;
  updateUserData: (x: Partial<IUserData>) => void;
  logout: () => void;
}

// user reducer actions
export type UserAction =
  | IGenericAction<'UPDATE USER DATA', Partial<IUserData>>
  | IGenericAction<'LOG OUT'>;
