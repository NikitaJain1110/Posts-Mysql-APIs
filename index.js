const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 5000;

//Routes
const UserRoutes = require("./Routes/user")
const PostRoutes = require("./Routes/post")
const CommentRoutes = require("./Routes/comment")

app.use("/user", UserRoutes)
app.use("/post", PostRoutes)
app.use("/comment", CommentRoutes)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Listen to port 5000
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
