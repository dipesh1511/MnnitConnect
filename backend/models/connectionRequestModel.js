import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
});

const connectionRequestModel =
  mongoose.models.connectionRequestModel ||
  mongoose.model("connectionRequest", connectionRequestSchema);

export default connectionRequestModel;
