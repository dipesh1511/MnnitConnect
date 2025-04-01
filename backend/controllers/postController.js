import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
//get feed possts

export const getFeedPosts = async (req, res) => {
  const { page = 1, limit = 30 } = req.query; // Default to page 1 and limit 10
  try {
    //console.log(req.user);
    const posts = await postModel
      .find({ user: { $ne: null } }) // Filter to exclude posts with null users
      .populate("user", "name username profilePicture bio") // Only populate necessary fields
      .populate("comments.user", "name profilePicture") // Populate comments with selected fields
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit) // Skip for pagination
      .limit(Number(limit)); // Limit the number of posts per page

    const totalPosts = await postModel.countDocuments({ user: { $ne: null } });
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages

    res.status(200).json({
      posts,
      totalPages,
      currentPage: Number(page),
      totalPosts,
    });
  } catch (error) {
    console.error("Error in getFeedPosts controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const content = req.body.content;
    //console.log(req.file);
    const image = req.file;
    let newPost;
    let imagePublicId = null;
    //console.log(image);
    if (image) {
      const result = await uploadOnCloudinary(image.path);
      imagePublicId = result?.public_id || null;
      //console.log("url", result.secure_url);
      newPost = await postModel.create({
        user: req.user._id,
        content,
        image: result.secure_url,
        imagePublicId: imagePublicId,
      });
    } else {
      newPost = await postModel.create({
        user: req.user._id,
        content,
      });
    }
    await newPost.save();
    // adding newpost id to user post array
    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
    });
    // console.log("Request body:", req.id);
    // console.log("Uploaded file:", req.file);

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    //console.log(req.user.connections);
    const posts = await postModel
      .find({ user: { $in: req.user.connections } })
      .populate("user", "name username profilePicture bio")
      .populate("comments.user", "name profilePicture")
      // .select("content image likes comments")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    //console.log("error in getfeedposts controller: ", error);
    res.status(500).json({ message: "server error" });
  }
};

export const getPostsByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await postModel
      .find({ user: user._id })
      .populate("user", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .sort({ createdAt: -1 });

    // if (!posts || posts.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ success: false, message: "No posts found for this user" });
    // }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in getPostsByUsername controller:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Update a post
// export const updatePost = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const postId = req.params.id;

//     let imageUrl;
//     if (req.file) {
//       try {
//         const result = await cloudinary.uploader.upload(req.file.path);
//         imageUrl = result.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload failed:", uploadError);
//         return res
//           .status(500)
//           .json({ message: "Error uploading image", error: uploadError });
//       }
//     }

//     const updateData = { content };
//     if (imageUrl) updateData.image = imageUrl;

//     const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, {
//       new: true,
//     });

//     res
//       .status(200)
//       .json({ message: "Post updated successfully", post: updatedPost });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating post", error });
//   }
// };

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // jiski post hai vhi banda post ko delete kar rha hai ya nahi??
    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you are not authorized to delete the post" });
    }
    // cloudinary s image ko bhi delete krna if post contains it!
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    await postModel.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    // console.log("ha backend s bol rha hu");
    const postId = req.params.id;
    const userId = req.user._id; // Assumes the user ID is available in req.user

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => !id.equals(userId));
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({
      message: isLiked ? "Like removed" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error in likePost:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  try {
    // backend s bat kr rha h apun
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Find the post by ID
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      text,
      user: userId,
    };
    post.comments.push(newComment);

    await post.save();

    await post.populate("comments.user", "name profilePicture");

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added successfully",
      comment: addedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
