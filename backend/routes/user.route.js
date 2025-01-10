const express = require("express");
const {
  addUserToDB,
  getMutualFriends,
  getSearchedValue,
  softDeleteUser,
  getSortedUserData,
  updateProfile,
} = require("../controllers/user.controller");

const route = express.Router();

route.post("/user/add", addUserToDB);
route.post("/user/mutualFriends/:username", getMutualFriends);
route.get("/search", getSearchedValue);
route.put("/softDelete/:username", softDeleteUser);
route.get("/sorteduser",getSortedUserData);
route.put('/updateProfile/:username',updateProfile);


module.exports = route;
