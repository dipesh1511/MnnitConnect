import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  //   res.json({ msg: "login API Working" });

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    // console.log("user is " + user._id);
    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user,
      token,
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const signupUser = async (req, res) => {
  //   res.json({ msg: "signup API Working" });

  try {
    //console.log("hi vinay");
    const { name, dob, email, username, password } = req.body;
    //console.log(req.body);

    if (!name || !dob || !email || !username || !password) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const mailExists = await userModel.findOne({ email });

    if (mailExists) {
      return res.json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const usernameExists = await userModel.findOne({ username });

    if (usernameExists) {
      return res.json({ success: false, message: "Username is taken." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //console.log(hashedPassword);

    const newUser = new userModel({
      name,
      dob,
      email,
      username,
      password: hashedPassword,
      role: "user",
    });
    //console.log("he he");

    const user = await newUser.save();

    const token = createToken(user._id);

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Account created successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json({ success: true, message: "User logged out succesfully." });
};

const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatableDetails = [
      "name",
      "profilePicture",
      "coverPhoto",
      "bio",
      "skills",
      "experience",
      "project",
      "education",
    ];

    const updatedDetails = {};

    // Loop through each updatable field and add it to updatedDetails if present in the request body
    for (const detail of updatableDetails) {
      if (req.body[detail]) {
        updatedDetails[detail] = req.body[detail];
      }
    }
    // console.log(req.body);
    // Upload profilePicture if provided
    if (req.body.profilePicture) {
      // console.log("hehe")
      const uploadResult = await cloudinary.uploader.upload(
        req.body.profilePicture
      );
      if (uploadResult) {
        updatedDetails.profilePicture = uploadResult.secure_url;
      }
    }

    //Upload coverPhoto if provided
    if (req.body.coverPhoto) {
      const uploadResult = await cloudinary.uploader.upload(
        req.body.coverPhoto
      );
      if (uploadResult) {
        updatedDetails.coverPhoto = uploadResult.secure_url;
      }
    }
    const user = await userModel
      .findByIdAndUpdate(req.user._id, { $set: updatedDetails }, { new: true })
      .select("-password");
    // console.log(user);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export { loginUser, signupUser, logoutUser, getCurrentUser, updateProfile };
