import mongoose from "mongoose";
import connectionRequestModel from "../models/connectionRequestModel.js";
import userModel from "../models/userModel.js";

const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel
      .findById(userId)
      .populate("connections", "name username profilePicture bio");

    res.json(user.connections);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      return res.json({
        success: false,
        message: "Connect with yourself IRL :).",
      });
    }

    if (req.user.connections.includes(userId)) {
      return res.json({
        success: false,
        message: "Already connected with this user.",
      });
    }

    const pendingRequest = await connectionRequestModel.findOne({
      sender: senderId,
      receiver: userId,
      status: "pending",
    });

    if (pendingRequest) {
      return res.json({
        success: false,
        message: "Previous request is pending.",
      });
    }

    const newRequest = new connectionRequestModel({
      sender: senderId,
      receiver: userId,
    });

    await newRequest.save();

    res.json({
      success: true,
      message: "Connection request sent successfully.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await connectionRequestModel.findById(requestId);

    if (!request) {
      return res.json({
        success: false,
        message: "No such connection request.",
      });
    }

    if (request.receiver._id.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "Cannot accept other's request.",
      });
    }

    if (request.status == "accepted") {
      return res.json({
        success: false,
        message: "Request already accepted.",
      });
    }
    if (request.status == "rejected") {
      return res.json({
        success: false,
        message: "Request already rejected.",
      });
    }

    request.status = "accepted";

    await request.save();

    await userModel.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: request.receiver._id },
    });
    await userModel.findByIdAndUpdate(request.receiver._id, {
      $addToSet: { connections: request.sender._id },
    });

    res.json({
      success: true,
      message: "Connection request accepted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await connectionRequestModel.findById(requestId);

    if (!request) {
      return res.json({
        success: false,
        message: "No such connection request.",
      });
    }

    if (request.receiver._id.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "Cannot reject other's request.",
      });
    }

    if (request.status == "accepted") {
      return res.json({
        success: false,
        message: "Request already accepted.",
      });
    }
    if (request.status == "rejected") {
      return res.json({
        success: false,
        message: "Request already rejected.",
      });
    }

    request.status = "rejected";

    await request.save();

    res.json({
      success: true,
      message: "Connection request rejected successfully.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestId = req.params.userId;

    // console.log(userId)
    // console.log(requestId)

    if(userId.toString() === requestId.toString()) {
      return res.json({
        success: true,
        message: "Self",
        val: 0,
      });
    }

    const isConnected = req.user.connections.some(conn => conn.toString() === new mongoose.Types.ObjectId(requestId).toString());

    if (isConnected) {
      return res.json({
        success: true,
        message: "Connected.",
        val: 1,
      });
    }

    const pendingRequest = await connectionRequestModel.findOne({
      $or: [
        { sender: userId, receiver: requestId },
        { sender: requestId, receiver: userId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === userId.toString()) {
        return res.json({ success: true, message: "Pending at their end.", val: 2});
      } else {
        return res.json({
          success: true,
          message: "Pending at your end.",
          val: 3,
          requestId: pendingRequest._id,
        });
      }
    }

    return res.json({ success: true, message: "Not connected.", val: 4});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await connectionRequestModel
      .find({ receiver: userId, status: "pending" })
      .populate("sender", "name username profilePicture bio");

    res.json(pendingRequests);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    const removeId = req.params.userId;

    const isConnected = req.user.connections.some(conn => conn.toString() === new mongoose.Types.ObjectId(removeId).toString());

    if (!isConnected) {
      return res.json({
        success: false,
        message: "Not connected to this user.",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      $pull: { connections: removeId },
    });
    await userModel.findByIdAndUpdate(removeId, {
      $pull: { connections: userId },
    });

    res.json({ success: true, message: "Connection removed successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getUserConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionStatus,
  getConnectionRequests,
  removeConnection,
};
