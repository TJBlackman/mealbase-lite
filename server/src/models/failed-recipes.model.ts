import mongoose from "mongoose";

const FailedRecipeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false,
  },
  submittedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FailedRecipeModel = mongoose.model("Failed Recipe", FailedRecipeSchema);
export default FailedRecipeModel;
