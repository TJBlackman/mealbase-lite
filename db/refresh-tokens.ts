import { RefreshToken } from "@src/types";
import mongoose, { Schema, model } from "mongoose";

const RefreshTokenSchema = new Schema<RefreshToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export const RefreshTokenModel =
  (mongoose.models["Refresh Tokens"] as mongoose.Model<
    RefreshToken,
    {},
    {},
    {}
  >) || model<RefreshToken>("Refresh Tokens", RefreshTokenSchema);
