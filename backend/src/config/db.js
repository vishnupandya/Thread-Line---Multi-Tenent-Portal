import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connects to MongoDB. Called once from server.js before app starts.
 * Throws if connection fails — server should not run without DB.
 */
export async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
}

export async function disconnectDB() {
  await mongoose.connection.close();
}