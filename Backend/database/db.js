import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    // Print the ACTUAL error message here so we can read it:
    console.log("MongoDB not connected. Reason:", error.message); 
    process.exit(1);
  }
};

export default connectDB;