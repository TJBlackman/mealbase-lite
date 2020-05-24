import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  roles: {
    type: [{ type: String }],
    required: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

// allows searching on email address
UserSchema.index({ email: 'text' });

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
