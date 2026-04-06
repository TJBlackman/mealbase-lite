import mongoose from "mongoose";

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STR;
console.log("MONGODB_URI", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.development"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.db;

if (!cached) {
  cached = global.db = { conn: null, promise: null };
}

export async function mongoDbConnection() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw new Error("Database is unreachable. Please try again later.");
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
