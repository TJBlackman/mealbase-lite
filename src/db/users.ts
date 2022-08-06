import mongoose, { Schema, model } from 'mongoose';
import { User } from '../types';

const UserSchema = new Schema<User>({
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  roles: {
    type: [{ type: String }],
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const UserModel =
  (mongoose.models.Users as mongoose.Model<User, {}, {}, {}>) ||
  model<User>('Users', UserSchema);
