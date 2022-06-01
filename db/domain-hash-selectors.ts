import mongoose from "mongoose";
import { DomainHashSelector } from "@src/types";

const DomainHashSelectorsSchema = new mongoose.Schema<DomainHashSelector>({
  domain: {
    type: String,
    required: true,
  },
  selector: {
    type: String,
    required: true,
    default: "",
  },
  isDynamic: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const collectionName = "DomainHashSelectors";

DomainHashSelectorsSchema.pre("save", function () {
  this.set({ updatedAt: new Date() });
});
DomainHashSelectorsSchema.pre("updateOne", function () {
  this.set({ updatedAt: new Date() });
});

export const DomainHashSelectorsModel =
  (mongoose.models[collectionName] as mongoose.Model<
    DomainHashSelector,
    {},
    {},
    {}
  >) || mongoose.model(collectionName, DomainHashSelectorsSchema);
