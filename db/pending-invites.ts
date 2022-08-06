import { RefreshToken } from '@src/types';
import mongoose, { Schema, model } from 'mongoose';

type PendingInvite = {
  email: string;
  createdAt: string | Date;
};

const PendingInviteSchema = new Schema<PendingInvite>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

export const PeningInviteModel =
  (mongoose.models['Refresh Tokens'] as mongoose.Model<
    PendingInvite,
    {},
    {},
    {}
  >) || model<PendingInvite>('PendingInvites', PendingInviteSchema);
