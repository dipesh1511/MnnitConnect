import express from "express";
import { searchUsers } from "../controllers/searchController.js";

const searchRouter = express.Router();
searchRouter.get("/search", searchUsers);

export default searchRouter;
