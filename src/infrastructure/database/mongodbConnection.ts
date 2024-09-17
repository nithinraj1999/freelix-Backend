import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/freelix');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if connection fails
  }
};
