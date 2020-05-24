import mongoose from 'mongoose';

const MealPlanSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    required: true,
    default: [],
  },
  recipes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    required: true,
    default: [],
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

const MealPlanModel = mongoose.model('MealPlan', MealPlanSchema);
export default MealPlanModel;