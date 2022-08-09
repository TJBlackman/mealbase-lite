import { RefreshToken } from '@src/types';
import mongoose, { Schema, model } from 'mongoose';

const RefreshTokenSchema = new Schema<RefreshToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const refreshTokenCollectionName = 'Refresh Tokens';

export const RefreshTokenModel =
  (mongoose.models[refreshTokenCollectionName] as mongoose.Model<
    RefreshToken,
    {},
    {},
    {}
  >) || model<RefreshToken>(refreshTokenCollectionName, RefreshTokenSchema);
