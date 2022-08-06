import { RefreshToken } from "@src/types";
import mongoose, { Schema, model } from "mongoose";

type Invitation = {
  email: string;
  createdAt: string | Date;
};

const InvitationSchema = new Schema<Invitation>({
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

export const InvitationModel =
  (mongoose.models["Refresh Tokens"] as mongoose.Model<
    Invitation,
    {},
    {},
    {}
  >) || model<Invitation>("PendingInvites", InvitationSchema);
