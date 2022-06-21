const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const { DB_URL } = require("./config/dbConfig");
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log("DB Error!", err);
  });
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.listen(5000, () => {
  console.log("server is running!");
});
