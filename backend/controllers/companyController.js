import companyModel from "../models/companyModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await companyModel.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Company does not exist." });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    const token = createToken(company._id);

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Company logged in successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const signupCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists =
      (await companyModel.findOne({ email })) ||
      (await companyModel.findOne({ name }));

    if (exists) {
      return res.json({ success: false, message: "Company already exists." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new companyModel({
      name,
      email,
      password: hashedPassword,
      role: "company",
    });

    const company = await newCompany.save();

    const token = createToken(company._id);

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Company account created successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const logoutCompany = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Company logged out succesfully." });
};

const getCurrentCompany = async (req, res) => {
  try {
    res.json(req.company);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatableDetails = [
      "profilePicture",
      "coverPhoto",
      "description",
    ];

    const updatedDetails = {};

    for (const detail of updatableDetails) {
      if (req.body[detail]) {
        updatedDetails[detail] = req.body[detail];
      }
    }

    if (req.body.profilePicture) {
      const uploadResult = await cloudinary.uploader.upload(
        req.body.profilePicture
      );
      if (uploadResult) {
        updatedDetails.profilePicture = uploadResult.secure_url;
      }
    }

    if (req.body.coverPhoto) {
      const uploadResult = await cloudinary.uploader.upload(
        req.body.coverPhoto
      );
      if (uploadResult) {
        updatedDetails.coverPhoto = uploadResult.secure_url;
      }
    }
    const company = await companyModel
      .findByIdAndUpdate(req.company._id, { $set: updatedDetails }, { new: true })
      .select("-password");
    res.json({ success: true, company });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export { loginCompany, signupCompany, logoutCompany, getCurrentCompany, updateProfile };
