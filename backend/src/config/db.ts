import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('Attempting to utilize mongodb-memory-server for isolated demonstration...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    const conn = await mongoose.connect(uri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};
