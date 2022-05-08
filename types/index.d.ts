import mongoose from 'mongoose';

declare global {
  var db: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

export enum Roles {
  User = 'User',
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

type RefreshToken = {
  userId: string;
};

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
}

type FailedRecipe = {
  url: string;
  addedByUser: string;
  createdAt: Date;
  resolved: boolean;
};

type RecipeLikeRecord = {
  userId: string;
  recipeId: string;
};
