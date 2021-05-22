import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    movies: {
      type: Array,
    },
    private: {
      type: Boolean,
      default: true,
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

export default mongoose.models.Watchlist ||
  mongoose.model("Watchlist", WatchlistSchema);
