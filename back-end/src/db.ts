import mongoose from 'mongoose';

import seedDatabase from './seed';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');
        // seedDatabase();
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error('Unexpected error', err);
        }
        process.exit(1);
    }
};

export default connectDB;
