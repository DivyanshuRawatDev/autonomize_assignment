const mongoose = require("mongoose");
require("dotenv").config({});

const databaseConnection = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database is connected")
};

module.exports = { databaseConnection };
