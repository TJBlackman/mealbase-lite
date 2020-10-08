import ResetPasswordModel from "../models/password-reset-record";
import { ResetPasswordRecord } from "../types/type-definitions";

// RPR => Reset Password Record

export const createRPR = async (data: { userId: string }) => {
  const record = new ResetPasswordModel({
    createdAt: new Date().toUTCString(),
    userId: data.userId
  });
  const savedRecord = await record.save();
  return savedRecord.toObject();
};


export const queryRPR = async (data: Partial<ResetPasswordRecord>) => {
  const result = await ResetPasswordModel.find(data, null, { lean: true });
  return result as unknown as ResetPasswordRecord[];
}

export const editRPR = async (data: Partial<ResetPasswordRecord>) => {
  if (!data._id) {
    throw new Error('Cannot edit RPR without _id');
  };
  const rpr = await ResetPasswordModel.findByIdAndUpdate(data._id, data, { new: true });
  return rpr.toObject() as unknown as ResetPasswordRecord;
}