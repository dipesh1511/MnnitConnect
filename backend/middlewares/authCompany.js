import jwt from "jsonwebtoken";
import companyModel from "../models/companyModel.js";

const protectCompanyRoute = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.json({ message: "Unauthorized Access: No token." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.json({ message: "Unauthorized Access: Invalid token." });
    }

    const company = await companyModel
      .findById(decodedToken.id)
      .select("-password");
    if (!company) {
      return res.json({ message: "Company not found." });
    }

    req.company = company;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default protectCompanyRoute;
