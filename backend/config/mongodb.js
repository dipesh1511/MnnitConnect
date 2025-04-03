import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const connectdb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
  await mongoose.connect(
    `${process.env.MONGODB_URI}`,
    { serverSelectionTimeoutMS: 5000 }
  );
};

export default connectdb;
