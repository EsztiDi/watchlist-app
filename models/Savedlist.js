import mongoose from "mongoose";

const SavedlistSchema = new mongoose.Schema(
  {
    user: {
      type: Object,
      required: true,
    },
    listid: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Object,
      required: true,
    },
    emails: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Savedlist ||
  mongoose.model("Savedlist", SavedlistSchema);
