import mongoose from "mongoose";
import { usersCollectionName } from "./users";

const EXPIRES_MINUTES = Number(
  process.env.RESET_PASSWORD_TOKEN_EXPIRES_MINUTES!
);

const PasswordResetSchema = new mongoose.Schema<PasswordResetRecord>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: () => {
      return new Date(Date.now() + 1000 * 60 * EXPIRES_MINUTES);
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
});

const passwordResetCollectionName = "Password-Resets";
export const PasswordResetModel =
  (mongoose.models?.[passwordResetCollectionName] as mongoose.Model<
    PasswordResetRecord,
    {},
    {},
    {}
  >) ||
  mongoose.model<PasswordResetRecord>(
    passwordResetCollectionName,
    PasswordResetSchema
  );

export type PasswordResetRecord = {
  user: mongoose.Schema.Types.ObjectId;
  expires: Date;
  createdAt: Date;
};
