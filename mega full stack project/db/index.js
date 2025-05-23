import mongoose from "mongoose"

const db = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to database");
    } catch (error) {
        console.error("MongoDB connection failed",error);
        // exit the process if connection fails
        process.exit(1);
    }
}

export default db;