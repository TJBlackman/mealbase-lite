import mongoose from 'mongoose';

declare global {
  var db: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

export enum Roles {
  User = 'User',
  AdminReadOnly = 'Admin ReadOnly',
  Admin = 'Admin',
}

interface User {
  createdAt: Date;
  updatedAt: Date;
  lastActiveDate: Date;
  email: string;
  password: string;
  roles: Roles[];
  deleted: Boolean;
}

type UserDocument = User & { _id: string };

interface RefreshToken {
  userId: string;
  createdAt: Date;
}

type UserJwt = {
  email: string;
  roles: Roles[];
  _id: string;
};

interface Recipe {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  likes: number;
  deleted: boolean;
  addedByUser: string;
  hash?: string;
}

type RecipeDocument = Recipe & { _id: string };

type ScrapedRecipeDate = Pick<
  Recipe,
  'description' | 'image' | 'siteName' | 'title' | 'url' | 'hash'
>;

type FailedRecipe = {
  url: string;
  addedByUser: string;
  createdAt: Date;
  resolvedDate: Date;
  resolved: boolean;
};

type RecipeLikeRecord = {
  userId: string;
  recipeId: string;
};

type PasswordResetRecord = {
  user: string;
  expires: Date;
  createdAt: Date;
};

type DomainHashSelector = {
  domain: string;
  selector: string;
  isDynamic: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDynamic: boolean;
};

export enum MealPlanPermissions {
  CompleteRecipes = 'CompleteRecipes',
  EditRecipes = 'EditRecipes',
  EditUsers = 'EditUsers',
}

interface MealPlan {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: RecipeDocument;
    isCooked: boolean;
  }[];
  members: {
    email: string;
    permission: MealPlanPermissions[];
  }[];
  owner: string;
}

type MealPlanDocument = MealPlan & { _id: string };
