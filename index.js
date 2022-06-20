const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
mongoose
  .connect("mongodb+srv://bccai:bccai@cluster0.csaxf.mongodb.net/social?retryWrites=true&w=majority")
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log("DB Error!");
  });
app.use("/api/user", userRoute);
app.listen(5000, () => {
  console.log("server is running!");
});
