const express = require("express");
const { databaseConnection } = require("./database/db");
require("dotenv").config({});
const UserRoute = require("./routes/user.route");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Working fine");
});

app.use("/api", UserRoute);

databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on PORT : " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database : " + err?.message);
  });
