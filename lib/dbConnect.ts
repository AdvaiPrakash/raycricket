import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://advai3330:DPHcD3FiVoKaV7Od@playerdb.fabna7r.mongodb.net/playerdb?retryWrites=true&w=majority&appName=playerDB';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Ensures global type doesn't throw for non-node environments
  // and avoids re-declaring in dev
  var mongoose: Cached;
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: Cached;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.mongoose;

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: 'playerdb', // optional: ensure it connects to the right DB
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
