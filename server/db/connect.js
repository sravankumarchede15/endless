import mongoose from 'mongoose';
import { appConfig } from '../config.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  const uri = appConfig.mongodbUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/endless';

  try {
    mongoose.set('strictQuery', true);

    // Set connection options
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error:`, err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[MongoDB] Disconnected`);
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log(`[MongoDB] Reconnected`);
      isConnected = true;
    });

    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Could not connect to ${uri}: ${error.message}. (Operating in fallback mode)`);
    return null;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getMongoStatus() {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    connected: isMongoConnected(),
    readyState: stateMap[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    uri: appConfig.mongodbUri ? appConfig.mongodbUri.replace(/:([^:@]+)@/, ':****@') : null,
  };
}
