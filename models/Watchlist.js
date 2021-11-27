import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    user: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
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
    shared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Watchlist ||
  mongoose.model("Watchlist", WatchlistSchema);
