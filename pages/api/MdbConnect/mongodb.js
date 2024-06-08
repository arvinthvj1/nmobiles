// lib/mongo.js
import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  // mongodb+srv://cilbertleon:v7n3zuLlytVRJ3pZ@black.wohx6ci.mongodb.net/black?retryWrites=true&w=majority&appName=black
  // mongodb+srv://arvinthvj:YinGWxdoNtyVva3a@cluster0.s4nxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  const client = new MongoClient("mongodb+srv://arvinthvj:YinGWxdoNtyVva3a@cluster0.s4nxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
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
