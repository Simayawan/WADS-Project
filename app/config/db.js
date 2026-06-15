import mongoose from 'mongoose';

// Hardcode the string temporarily to prove the connection works
const dbURI = "mongodb+srv://allenxavinzkyadjiewibowo_db_user:wlw8EYgEPiQZnje5@cluster0.721b7sb.mongodb.net/haq_db?appName=Cluster0";
const dbConnect = async () => {
  // If we are already connected, don't open a new one
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(dbURI);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err);
    throw new Error('Database connection failed');
  }
};

export default dbConnect;