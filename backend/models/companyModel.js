import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPhoto: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "company",
  },
  description: {
    type: String,
    default: "",
  },
  jobsPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
});

const companyModel =
  mongoose.models.company || mongoose.model("company", companySchema);

export default companyModel;
