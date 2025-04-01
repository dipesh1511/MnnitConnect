import express from "express";
import {
  createPost,
  getFeedPosts,
  //updatePost,
  deletePost,
  likePost,
  addComment,
  getPostsByUsername,
  getAllPosts,
} from "../controllers/postController.js";
import { upload } from "../middlewares/multer.js";
import protectUserRoute from "../middlewares/authUser.js";
const router = express.Router();

// Middleware for authentication would go here

router.post("/", protectUserRoute, upload.single("image"), createPost); // Create a post with image upload
router.get("/", protectUserRoute, getFeedPosts); // Get all posts for feed
router.get("/all", protectUserRoute, getAllPosts); // Get all posts for feed
router.get("/:username", protectUserRoute, getPostsByUsername); // Get all posts by id
// router.put("/:id", upload.single("image"), updatePost); // Update a post with image upload
router.delete("/:id", protectUserRoute, deletePost); // Delete a post
router.post("/:id", protectUserRoute, likePost); // Like/unlike a post
router.post("/:id/comment", protectUserRoute, addComment); // Add a comment to a post

export default router;
