import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/multiapi';
    await mongoose.connect(mongoURI, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
