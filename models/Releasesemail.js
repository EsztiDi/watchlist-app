import mongoose from "mongoose";

const ReleasesemailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    listid: {
      type: String,
      trim: true,
    },
    uid: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Releasesemail ||
  mongoose.model("Releasesemail", ReleasesemailSchema);
