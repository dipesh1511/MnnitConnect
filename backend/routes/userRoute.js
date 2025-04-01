import express from "express";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
} from "../controllers/userController.js";
import protectUserRoute from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get("/profile", protectUserRoute, getCurrentUser);
userRouter.put("/updateprofile", protectUserRoute, updateProfile);

export default userRouter;
