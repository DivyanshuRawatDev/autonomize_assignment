const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true,lowercase:true },
  avatar_url: String,
  github_url: String,
  followers_url: String,
  following_url: String,
  repos_url: String,
  name: String,
  blog: String,
  location: String,
  bio: String,
  public_repos: Number,
  public_gists: Number,
  followers: Number,
  following: Number,
  mutualFriends: [],
  created_at: String,
  isDeleted: {type:Boolean, default:false},
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
