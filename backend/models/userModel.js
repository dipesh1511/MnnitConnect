import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
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
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: Array,
  },
  experience: [
    {
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  project: [
    {
      title: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  education: [
    {
      instituteName: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
    },
  ],
  role: {
    type: String,
    required: true,
  },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  jobsApplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
