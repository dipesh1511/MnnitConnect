import express from "express";
import {
  addJob,
  showJob,
  showAllJob,
  removeJob,
  showCompanyJob,
  showAllActiveJob,
  showCompanyActiveJob,
  changeStatus,
  applyForJob,
  showAppliedJobs,
  showApplicants,
} from "../controllers/jobController.js";
import protectCompanyRoute from "../middlewares/authCompany.js";
import protectUserRoute from "../middlewares/authUser.js";

const jobRouter = express.Router();

jobRouter.post("/add", protectCompanyRoute, addJob);
jobRouter.get("/show/:jobId", showJob);
jobRouter.get("/showall", showAllJob);
jobRouter.get("/showactive", showAllActiveJob);
jobRouter.get("/showall/:companyId", showCompanyJob);
jobRouter.get("/showactive/:companyId", showCompanyActiveJob);
jobRouter.post("/changestatus/:jobId", protectCompanyRoute, changeStatus);
jobRouter.post("/remove/:jobId", protectCompanyRoute, removeJob);
jobRouter.post("/apply/:jobId", protectUserRoute, applyForJob);
jobRouter.get("/showapplied", protectUserRoute, showAppliedJobs);
jobRouter.get("/showapplicant/:jobId", protectCompanyRoute, showApplicants);

export default jobRouter;
