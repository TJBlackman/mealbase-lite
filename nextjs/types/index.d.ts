import mongoose from "mongoose";

declare global {
  var db: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

export enum Roles {
  User = 10,
  Admin = 50,
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
