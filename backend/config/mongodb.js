import mongoose from "mongoose";

const connectdb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
  await mongoose.connect(
    `${process.env.MONGODB_URI}/Avengers-Assemble-Network`,
    { serverSelectionTimeoutMS: 5000 }
  );
};

export default connectdb;
