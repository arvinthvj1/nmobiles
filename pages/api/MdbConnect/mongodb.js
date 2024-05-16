// lib/mongo.js
import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient("mongodb+srv://cilbertleon:v7n3zuLlytVRJ3pZ@black.wohx6ci.mongodb.net/black?retryWrites=true&w=majority&appName=black", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export { connectToDatabase };
