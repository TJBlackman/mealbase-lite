import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema<Invitation>({
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

export const InvitationCollectionName = "invitations";

export const InvitationModel =
  (mongoose.models?.[InvitationCollectionName] as mongoose.Model<
    Invitation,
    {},
    {},
    {}
  >) || mongoose.model<Invitation>(InvitationCollectionName, InvitationSchema);

export type Invitation = {
  email: string;
  createdAt: string | Date;
};
