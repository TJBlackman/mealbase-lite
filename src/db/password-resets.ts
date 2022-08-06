import { PasswordResetRecord } from '@src/types';
import mongoose from 'mongoose';

const EXPIRES_MINUTES = Number(
  process.env.RESET_PASSWORD_TOKEN_EXPIRES_MINUTES!
);

const PasswordResetSchema = new mongoose.Schema<PasswordResetRecord>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
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

const name = 'Password-Resets';
export const PasswordResetModel =
  (mongoose.models[name] as mongoose.Model<PasswordResetRecord, {}, {}, {}>) ||
  mongoose.model<PasswordResetRecord>(name, PasswordResetSchema);
