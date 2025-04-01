import express from "express";
import protectUserRoute from "../middlewares/authUser.js";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connectionController.js";

const connectionRouter = express.Router();

// Get all Connections of user
connectionRouter.get("/", protectUserRoute, getUserConnections);

// Options for a connection request
connectionRouter.post(
  "/request/:userId",
  protectUserRoute,
  sendConnectionRequest
);
connectionRouter.put(
  "/accept/:requestId",
  protectUserRoute,
  acceptConnectionRequest
);
connectionRouter.put(
  "/reject/:requestId",
  protectUserRoute,
  rejectConnectionRequest
);
connectionRouter.get("/status/:userId", protectUserRoute, getConnectionStatus);

// Get all Connectin requests of user
connectionRouter.get("/requests", protectUserRoute, getConnectionRequests);

// Remove connection - katti
connectionRouter.delete("/:userId", protectUserRoute, removeConnection);

export default connectionRouter;
