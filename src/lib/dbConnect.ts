import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables");
}

// Cache connections across hot reloads in dev mode
let cached = (global as any).mongoose || { conn: null, promise: null, gfs: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "formbuilder",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  // Initialize GridFSBucket once connection is ready
  if (!cached.gfs) {
    cached.gfs = new mongoose.mongo.GridFSBucket(cached.conn.connection.db, {
      bucketName: "uploads",
    });
  }

  (global as any).mongoose = cached; // persist across hot reloads
  return cached.conn;
}

/**
 * Returns the GridFSBucket instance.
 * Make sure to call dbConnect() before using this.
 */
export function getGridFSBucket() {
  if (!cached.conn || !cached.gfs) {
    throw new Error("Database not connected. Call dbConnect() first.");
  }
  return cached.gfs;
}
