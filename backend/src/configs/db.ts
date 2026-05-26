import mongoose from "mongoose";
import env from "dotenv";
env.config();

export const mongoUri: string | undefined =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_DEVELOPMENT_CONNECTION_STRING
    : process.env.MONGODB_TEST_CONNECTION_STRING;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri || "");
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.log(error);
  }
};
