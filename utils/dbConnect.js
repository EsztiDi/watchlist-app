import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/* Global is used here to maintain a cached connection across hot reloads in development */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
      // For "Warning: Top-level use of w, wtimeout, j, and fsync is deprecated. Use writeConcern instead."
      writeConcern: {
        w: null,
        wtimeout: null,
        j: null,
        fsync: null,
      },
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully. ^^");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
