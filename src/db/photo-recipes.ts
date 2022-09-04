import mongoose from 'mongoose';

// defined schema for cloudinary image shape
const CloudinaryImageSchema = new mongoose.Schema<CloudinaryImage>({
  asset_id: String,
  public_id: String,
  version: Number,
  version_id: String,
  signature: String,
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
  created_at: Date,
  tags: [String],
  bytes: Number,
  type: String,
  etag: String,
  placeholder: Boolean,
  url: String,
  secure_url: String,
  folder: String,
  access_mode: String,
  existing: Boolean,
  original_filename: String,
});

const PhotoRecipeSchema = new mongoose.Schema<PhotoRecipe>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  images: {
    type: [CloudinaryImageSchema],
    required: true,
    default: () => [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

export const SlideshowsModel =
  (mongoose.models.Slideshows as mongoose.Model<
    SlideshowDocument,
    {},
    {},
    {}
  >) || model<SlideshowDocument>('Slideshows', SlideshowSchema);

export interface CloudinaryImage {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  existing: boolean;
  original_filename: string;
}

export interface PhotoRecipe {
  title: string;
  description?: string;
  owner: mongoose.Schema.Types.ObjectId;
  images: CloudinaryImage[];
}
