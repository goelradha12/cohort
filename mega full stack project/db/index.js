import mongoose from "mongoose"
import dotenv from "dotenv"


// dotenv.config({path:"./.env"})

// const MONGO_URI = "mongodb://localhost:27017/mydatabase";

const db = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to databse");
    } catch (error) {
        console.error("MongoDB connection failed",error);
        // exit the process if connection fails
        process.exit(1);
    }
}

export default db;