import companyModel from "../models/companyModel.js";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

const addJob = async (req, res) => {
  try {
    const {
      jobTitle,
      description,
      location,
      salary,
      skills,
      experience,
      qualifications,
    } = req.body;

    const job = new jobModel({
      jobTitle,
      company: req.company.name,
      description,
      location,
      salary,
      skills: skills && skills.length > 0 ? skills : ["None"],
      experience: experience || "None",
      qualifications:
        qualifications && qualifications.length > 0 ? qualifications : ["None"],
      datePosted: Date.now(),
      status: "active",
    });

    await job.save();

    // console.log(req.company._id);
    await companyModel.findByIdAndUpdate(req.company._id, {
      $addToSet: { jobsPosted: job._id },
    });

    return res.json({ success: true, message: "Job added." });
  } catch (error) {
    console.error("Error adding job:", error);
    return res.json({ success: false, message: "Job not added." });
  }
};

const showJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId);

    if (!job) {
      return res.json({ success: false, message: "Job not found." });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error finding job." });
  }
};

const showAllJob = async (req, res) => {
  try {
    const jobs = await jobModel.find(
      {},
      { jobTitle: 1, salary: 1, location: 1, company: 1 }
    );

    res.json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not get jobs." });
  }
};

const showAllActiveJob = async (req, res) => {
  try {
    const jobs = await jobModel.find(
      { status: "active" },
      { jobTitle: 1, salary: 1, location: 1, company: 1 }
    );

    res.json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not get active jobs." });
  }
};

const showCompanyJob = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found." });
    }

    const jobs = await jobModel.find(
      { _id: { $in: company.jobsPosted } },
      { jobTitle: 1, salary: 1, location: 1 }
    );

    res.json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Could not get jobs." });
  }
};

const showCompanyActiveJob = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found." });
    }

    const jobs = await jobModel.find(
      {
        _id: { $in: company.jobsPosted },
        status: "active",
      },
      { jobTitle: 1, salary: 1, location: 1, company: 1 }
    );

    res.json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Could not get jobs." });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyName = req.company.name;
    const job = await jobModel.findById(jobId);

    if (!job) {
      return res.json({ success: false, message: "Job not found." });
    }

    if (job.company !== companyName) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied: Unauthorized company.",
        });
    }

    job.status = job.status === "active" ? "inactive" : "active";
    await job.save();

    res.json({
      success: true,
      message: `Job status changed to ${job.status}.`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not change job status." });
  }
};

const removeJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { jobId } = req.params;
    const companyName = req.company.name;

    const job = await jobModel.findById(jobId).session(session);
    if (!job) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    if (job.company !== companyName) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Access denied: Unauthorized company.",
      });
    }

    const companyUpdate = await companyModel.findByIdAndUpdate(
      req.company._id,
      { $pull: { jobsPosted: jobId } },
      { new: true, session }
    );

    if (!companyUpdate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Company update failed.",
      });
    }

    const applicants = job.applicants || [];
    if (applicants.length > 0) {
      await userModel.updateMany(
        { _id: { $in: applicants } },
        { $pull: { jobsApplied: jobId } },
        { session }
      );
    }

    await jobModel.findByIdAndDelete(jobId, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Job removed successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error removing job:", error);
    res.status(500).json({ success: false, message: "Could not remove job." });
  }
};

const applyForJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const job = await jobModel.findById(jobId).session(session);
    if (!job) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    if (job.status !== "active") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Cannot apply. Job is inactive." });
    }

    const jobUpdate = await jobModel.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: userId } },
      { new: true, session }
    );

    if (!jobUpdate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const userUpdate = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { jobsApplied: jobId } },
      { new: true, session }
    );

    if (!userUpdate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Successfully applied for this job." });
  } catch (error) {
    console.error("Error applying for job:", error);
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    session.endSession();
  }
};

const showAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId).populate({
      path: "jobsApplied",
      select: "jobTitle company location salary",
    });

    if (user.jobsApplied.length === 0) {
      return res.status(200).json({
        success: true,
        message: "User has not applied for any job.",
        appliedJobs: [],
      });
    }

    res.status(200).json({
      success: true,
      appliedJobs: user.jobsApplied,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const showApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyName = req.company.name;

    const job = await jobModel.findById(jobId).populate({
      path: "applicants",
      select: "name username email",
    });

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found." });
    }

    if (job.company !== companyName) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied: Unauthorized company.",
        });
    }

    res.status(200).json({
      success: true,
      jobTitle: job.jobTitle,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  addJob,
  showJob,
  showAllJob,
  showAllActiveJob,
  showCompanyJob,
  showCompanyActiveJob,
  changeStatus,
  removeJob,
  applyForJob,
  showAppliedJobs,
  showApplicants,
};
