import mongoose, { Schema, model } from "mongoose";
import { User } from "../types";

const UserSchema = new Schema<User>({
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  lastActiveDate: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  roles: {
    type: [{ type: Number }],
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const UserModel =
  mongoose.models.Users || model<User>("Users", UserSchema);
