import express from "express";
import {
  getCurrentCompany,
  loginCompany,
  logoutCompany,
  signupCompany,
  updateProfile,
} from "../controllers/companyController.js";
import protectCompanyRoute from "../middlewares/authCompany.js";

const companyRouter = express.Router();

companyRouter.post("/signup", signupCompany);
companyRouter.post("/login", loginCompany);
companyRouter.post("/logout", logoutCompany);

companyRouter.get("/profile",protectCompanyRoute, getCurrentCompany);
companyRouter.put("/updateprofile", protectCompanyRoute, updateProfile);

export default companyRouter;
