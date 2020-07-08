
export interface ValidationResult {
  error: undefined | string;
  result?: boolean;
}
interface basicQueryOptions {
  _id?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: 1 | -1;
  deleted?: boolean;
  projections?: string;
  search?: string;
}
interface basicRecordOptions {
  _id?: string;
  __v?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface GetUsersQuery extends basicQueryOptions {
  email?: string | { $regex: string; $options: string; };
  role?: string;
}
export interface GetUsersDbConditions {
  deleted: boolean;
  email?: string | any;
  _id?: string;
  roles?: string;
  $text?: any;
}
export interface NewUserData {
  email: string;
  password: string;
}
export interface ExistingUserData {
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  roles?: string[];
  _id?: string;
  deleted?: boolean;
  __v?: number;
  organizations?: {
    admin: string[];
    member: string[];
  }
}
export interface JWTUser {
  email: string;
  _id: string;
  roles: string[];
  organizations: {
    member: string[];
    admin: string[];
  };
}
export enum Roles {
  Admin = 'admin',
  Support = 'support',
  PremiumUser = 'premiumUser',
  User = 'user'
};
export interface RecipeRecord extends basicRecordOptions {
  title?: string | any;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  likes?: number;
}
export interface RecipeQuery extends basicQueryOptions {
  url?: string;
}
export interface CookbookQuery extends basicQueryOptions {
  userId?: string;
}
export interface CookbookRecord extends basicRecordOptions {
  title?: string;
  owner?: string;
  sharedWith?: string[];
  recipes?: string[];
}
export interface MealPlanRecord extends basicRecordOptions {
  owner?: string;
  sharedWith?: string[];
  recipes?: string[];
  title?: string;
}
export interface MealPlanQuery extends basicQueryOptions {
  owner?: string;
  sharedWith?: string;
}
export interface IRecipeLikeRecord extends basicRecordOptions {
  userId: string;
  recipeId: string;
}
export interface IRecipeLikeRequest {
  userId: string;
  recipeId: string;
}