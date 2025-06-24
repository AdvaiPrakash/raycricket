import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://advai3330:DPHcD3FiVoKaV7Od@playerdb.fabna7r.mongodb.net/playerdb?retryWrites=true&w=majority&appName=playerDB';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
