import userModel from "../models/userModel.js";
import { Trie } from "../utils/tries.js";

export const nameTrie = new Trie();
export const skillTrie = new Trie();
export const titleTrie = new Trie();
export const locationTrie = new Trie();

export const populateTries = async () => {
  try {
    const users = await userModel.find({}, "name skills title location");

    users.forEach((user) => {
      nameTrie.insert(user.name, user._id.toString());
      if (user.skills) {
        user.skills.forEach((skill) =>
          skillTrie.insert(skill, user._id.toString())
        );
      }
      if (user.title) {
        titleTrie.insert(user.title, user._id.toString());
      }
      if (user.location) {
        locationTrie.insert(user.location, user._id.toString());
      }
    });

    console.log("Tries populated successfully with user data.");
  } catch (error) {
    console.error("Error populating tries:", error);
  }
};
