import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const protectUserRoute = async (req, res, next) => {
  try {
    //console.log(req.params.userId);
    const token = req.cookies["token"];
    if (!token) {
      return res.json({ message: "Unauthorized Access: No token." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.json({ message: "Unauthorized Access: Invalid token." });
    }

    // return res.json({decodedToken});
    //console.log("begin");

    const response = await userModel
      .findById(decodedToken.id)
      .select("-password");
    if (!response) {
      return res.json({ message: "User not found." });
    }

    req.user = {
      ...response.toObject(),
      isOwner: true, // This will always be true since the profile matches the logged-in user
    };
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default protectUserRoute;
