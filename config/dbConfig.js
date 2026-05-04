import mongoose from "mongoose";

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.DB_URI);

        console.log("MongoDB Connected");
    } 
    
    catch (error) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
}

export default connectDB;