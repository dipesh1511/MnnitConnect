import express from "express";
import protectUserRoute from "../middlewares/authUser.js";
import { exploreProfile, getSuggestedConnections } from "../controllers/exploreController.js";

const exploreRouter = express.Router();

exploreRouter.get("/suggestions", protectUserRoute, getSuggestedConnections);
exploreRouter.get("/:username", exploreProfile);

export default exploreRouter;