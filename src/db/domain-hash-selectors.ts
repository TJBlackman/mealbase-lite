import mongoose from 'mongoose';

const DomainHashSelectorsSchema = new mongoose.Schema<DomainHashSelector>({
  domain: {
    type: String,
    required: true,
  },
  selector: {
    type: String,
    required: true,
    default: '',
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

const domainHashCollectionName = 'DomainHashSelectors';

DomainHashSelectorsSchema.pre('save', function () {
  this.set({ updatedAt: new Date() });
});
DomainHashSelectorsSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

export const DomainHashSelectorsModel =
  (mongoose.models?.[domainHashCollectionName] as mongoose.Model<
    DomainHashSelector,
    {},
    {},
    {}
  >) || mongoose.model(domainHashCollectionName, DomainHashSelectorsSchema);

export type DomainHashSelector = {
  domain: string;
  selector: string;
  isDynamic: boolean;
  createdAt: Date;
  updatedAt: Date;
};
