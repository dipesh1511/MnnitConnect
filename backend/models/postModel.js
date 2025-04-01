import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    image: {
      type: String,
      // optional, as posts can be text-only
    },
    imagePublicId: {
      // public id of image on cloudinary so that if a post is deleted it can also be destroyed from the cloudinary
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;
