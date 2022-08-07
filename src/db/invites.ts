import mongoose, { Schema, model } from "mongoose";

export type Invitation = {
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

export const InvitationCollectionName = "Invitations";

export const InvitationModel =
  (mongoose.models[InvitationCollectionName] as mongoose.Model<
    Invitation,
    {},
    {},
    {}
  >) || model<Invitation>(InvitationCollectionName, InvitationSchema);
