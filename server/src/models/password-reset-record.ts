import mongoose from 'mongoose';
import { PASSWORD_RESET_RECORD, USER_RECORD } from "./types";

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_RECORD,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  valid: {
    type: Boolean,
    required: true,
    default: true
  }
});

const PasswordResetModel = mongoose.model(PASSWORD_RESET_RECORD, PasswordResetSchema);

export default PasswordResetModel; 