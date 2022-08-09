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

type DomainHashSelector = {
  domain: string;
  selector: string;
  isDynamic: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDynamic: boolean;
};
