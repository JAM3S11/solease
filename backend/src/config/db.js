import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log("🔍 MONGO_URI:", uri ? uri.replace(/:([^:@]+)@/, ':****@') : "❌ UNDEFINED");
        await mongoose.connect(uri);
        console.log("MONGO DB connected successfully");
    } catch (error) {
        console.error("Error connecting to MONGODB", error);
        process.exit(1); //Will exit the connnection after failure
    }
}