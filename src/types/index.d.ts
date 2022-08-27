import mongoose from "mongoose";

declare global {
  var db: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

type ObjectIdString = string;

type With_Id<T> = T & {
  _id: ObjectIdString;
};

type UserJwt = With_Id<{
  email: string;
  roles: Roles[];
}>;
