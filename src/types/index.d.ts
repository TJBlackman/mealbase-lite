import mongoose from "mongoose";

declare global {
  var db: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

export enum Roles {
  User = "User",
  Admin = "Admin",
}

type ObjectIdString = string;

type With_Id<T> = T & {
  _id: ObjectIdString;
};

interface User {
  createdAt: Date;
  updatedAt: Date;
  lastActiveDate: Date;
  email: string;
  password: string;
  roles: Roles[];
  deleted: Boolean;
}

type UserDocument = With_Id<User>;

interface RefreshToken {
  userId: ObjectIdString;
  createdAt: Date;
}

type UserJwt = With_Id<{
  email: string;
  roles: Roles[];
}>;

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
  addedByUser: ObjectIdString;
  hash?: string;
}

type RecipeDocument = With_Id<Recipe>;

type ScrapedRecipeDate = Pick<
  Recipe,
  "description" | "image" | "siteName" | "title" | "url" | "hash"
>;

type FailedRecipe = {
  url: string;
  addedByUser: ObjectIdString;
  createdAt: Date;
  resolvedDate: Date;
  resolved: boolean;
};

type RecipeLikeRecord = {
  userId: ObjectIdString;
  recipeId: string;
};

type PasswordResetRecord = {
  user: ObjectIdString;
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
  CompleteRecipes = "CompleteRecipes",
  EditRecipes = "EditRecipes",
  EditUsers = "EditUsers",
}

interface MealPlan {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: ObjectIdString;
    isCooked: boolean;
  }[];
  members: {
    member: ObjectIdString;
    permissions: MealPlanPermissions[];
  }[];
  pendingMembers: {
    _id: ObjectIdString;
  }[];
  owner: ObjectIdString;
}

type MealPlanDocument = With_Id<MealPlan>;
