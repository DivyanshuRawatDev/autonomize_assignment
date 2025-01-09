const { default: axios } = require("axios");
const { UserModel } = require("../models/user.model");

// 1 - Add User data to database :-

const fetchUserData = async (username) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${username}`
    );
    return data;
  } catch (error) {
    console.log("Error while fetching data from github API : " + error.message);
  }
};

const addUserToDB = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      return res
        .status(200)
        .json({ message: "User already present", data: user });
    }

    const userData = await fetchUserData(username);

    let newUser = await UserModel.create({
      username: userData?.login,
      avatar_url: userData?.avatar_url,
      github_url: userData?.html_url,
      followers_url: userData?.followers_url,
      following_url: userData?.following_url,
      repos_url: userData?.repos_url,
      name: userData?.name,
      blog: userData?.blog,
      location: userData?.location,
      bio: userData?.bio,
      public_repos: userData?.public_repos,
      public_gists: userData?.public_gists,
      followers: userData?.followers,
      following: userData?.following,
      created_at: userData?.created_at,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User data added successfully", data: newUser });
  } catch (error) {
    console.log("Error while add user to DB : " + error.message);
  }
};

// 2 - Get mutual friends :-

const fetchFriendsData = async (url) => {
  try {
    const { data } = await axios.get(url.replace("{/other_user}", ""));
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getMutualFriends = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.followers_url);

    const followers = await fetchFriendsData(user?.followers_url);
    const followings = await fetchFriendsData(user?.following_url);

    const mutualFriends = [];

    followers.forEach((follower) => {
      if (followings.map((f) => f.login).includes(follower.login)) {
        mutualFriends.push(follower);
      }
    });

    user.mutualFriends = mutualFriends;
    await user.save();

    return res.status(200).json({
      message: "mutual Friends",
      friends: mutualFriends,
      followers,
      followings,
    });
  } catch (error) {
    console.log("Error while getting followers : " + error?.message);
  }
};

// 3 - get searched value :-

const getSearchedValue = async (req, res) => {
  const { username, location } = req.query;
  try {
    const query = { isDeleted: false };

    if (username) query.username = new RegExp(username, "i");
    if (location) query.location = new RegExp(location, "i");

    const users = await UserModel.find(query);

    return res
      .status(200)
      .json({ message: "users fetched successfully", data: users });
  } catch (error) {
    console.log(error);
  }
};

// 4 - SoftDeleteUser :-

const softDeleteUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { isDeleted: true },
      { new: true }
    );

    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("Error while soft delete user : " + error.message);
  }
};

// 5 - get sorted userData :-

const getSortedUserData = async (req, res) => {
  const { sortBy } = req.query;
  try {
    const sortField = sortBy || "created_at";

    const sortedUsers = await UserModel.find({ isDeleted: false }).sort({
      [sortField]: 1,
    });

    return res.status(200).json({ message: "sorted succesfully", data: sortedUsers });
  } catch (error) {
    console.log("Error while get sorted user data" + error.message);
  }
};

module.exports = {
  addUserToDB,
  getMutualFriends,
  getSearchedValue,
  softDeleteUser,
  getSortedUserData
};
