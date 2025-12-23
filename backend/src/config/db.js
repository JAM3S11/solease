import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        // console.log("mongo_uri", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB connected successfully");
    } catch (error) {
        console.error("Error connecting to MONGODB", error);
        process.exit(1); //Will exit the connnection after failure
    }
}