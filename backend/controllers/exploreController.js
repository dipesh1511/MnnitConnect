import userModel from "../models/userModel.js";

const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await userModel
      .findById(req.user._id)
      .select("connections");

    const suggestedUsers = await userModel
      .find({
        _id: {
          $ne: req.user._id,
          $nin: currentUser.connections,
        },
      })
      .select("name username profilePicture bio")
      .limit(5);

    res.json(suggestedUsers);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const exploreProfile = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export { getSuggestedConnections, exploreProfile };
