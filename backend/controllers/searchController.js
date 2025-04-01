import userModel from "../models/userModel.js";
import {
  nameTrie,
  skillTrie,
  titleTrie,
  locationTrie,
} from "../config/populateTrie.js";

export const searchUsers = async (req, res) => {
  const { query, field, page = 1, pageSize = 10 } = req.query;
  let userIds;
  //console.log("backend  snhjfsf");
  switch (field) {
    case "name":
      userIds = nameTrie.search(query);
      break;
    case "skills":
      userIds = skillTrie.search(query);
      break;
    case "title":
      userIds = titleTrie.search(query);
      break;
    case "location":
      userIds = locationTrie.search(query);
      break;
    default:
      return res.status(400).json({ error: "Invalid search field" });
  }

  const matchedUserIds = Array.from(userIds);
  const totalResults = matchedUserIds.length;

  // Paginate results
  const paginatedIds = matchedUserIds.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  try {
    const users = await userModel.find({ _id: { $in: paginatedIds } });
    res.json({ users, totalResults });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
