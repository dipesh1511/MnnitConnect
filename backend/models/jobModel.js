import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  qualifications: {
    type: Array,
    required: false,
  },
  datePosted: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const jobModel = mongoose.models.job || mongoose.model("job", jobSchema);

export default jobModel;
