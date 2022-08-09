import mongoose from "mongoose";
import { usersCollectionName } from "./users";

const RefreshTokenSchema = new mongoose.Schema<RefreshToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const refreshTokenCollectionName = "Refresh Tokens";

export const RefreshTokenModel =
  (mongoose.models?.[refreshTokenCollectionName] as mongoose.Model<
    RefreshToken,
    {},
    {},
    {}
  >) ||
  mongoose.model<RefreshToken>(refreshTokenCollectionName, RefreshTokenSchema);

interface RefreshToken {
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}
