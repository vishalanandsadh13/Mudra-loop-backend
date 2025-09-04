const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri || typeof uri !== 'string' || uri.trim() === '') {
        console.error('MongoDB connection failed: MONGO_URI/MONGODB_URI is not set.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {});
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;