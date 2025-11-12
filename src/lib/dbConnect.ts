import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables");
}

const cached = (global as any).mongoose || {
  conn: null,
  promise: null,
  gfs: null,
};

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "formbuilder",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  if (!cached.gfs) {
    cached.gfs = new mongoose.mongo.GridFSBucket(cached.conn.connection.db, {
      bucketName: "uploads",
    });
  }

  (global as any).mongoose = cached;
  return cached.conn;
}

export function getGridFSBucket() {
  if (!cached.conn || !cached.gfs) {
    throw new Error("Database not connected. Call dbConnect() first.");
  }
  return cached.gfs;
}
