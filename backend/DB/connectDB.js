// it's connectDb where just connecting DB 

import { mongoose } from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connection Succesfull : ${conn.connection.host}`);
    } catch (error) {
        console.log("Error while connecting DB");
        process.exit(1); // 1 for failur 0 for success

    }
}

