const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
var bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "user_post"
});

//Base function
function base(res,query,parameters){
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query(
      query,
      parameters,
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log(rows);
        res.json(rows)
      }
    );
  });
}

//Create user
app.post("/user/create", async (req, res, next) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const data = {
    username: username,
    password: hashedPassword,
  };
  base(res,
    "INSERT INTO user SET ?",
    [data]
  )
});

//Get user by username
app.post("/getuserbyusername", (req, res) => {

  base(res,
    "SELECT * from user WHERE username=?",
    [req.body.username]
  )
});

//Create Posts
app.post("/post/create", (req, res) => {
  const data = {
    content: req.body.content,
    userid: req.body.userid,
  }
  base(res,
    "INSERT INTO post SET ?",
    data
  )
});

//Delete post????????????????
app.post("/post/delete",(req, res) => {
  base(res,
    "DELETE post, comment from post left join comment on post.id=comment.postid WHERE post.id= ?",
      [req.body.pid]
  )
});

//Update post
app.post("/post/update", (req, res) => {
  base(res,
    "UPDATE `post` SET content=? WHERE id=?",
    [req.body.content,req.body.pid]
  )
});

//Get all posts
app.post("/posts/get",(req, res) => {
  base(res,
    "SELECT post.*, user.username FROM post join user on post.userid=user.id",
    []
  )
});

//Get all posts of a User
app.post("/posts/user/get", (req, res) => {
  base(res,
    "SELECT content from post WHERE userid=?",
    [req.body.uid]
  )
});

//Add comment by a User
app.post("/post/comment/add", (req, res) => {
  const data = {
    comment: req.body.comment,
    commenter: req.body.uid,
    postid: req.body.pid,
  };
  base(res,
    "INSERT into comment SET?",
      data,
  )
});

//Get all comments by a specific user on a specific post
app.post("/post/comment/user", (req, res) => {
  base(res,
    "SELECT comment from comment WHERE commenter=? and postid=?",
    [req.body.uid, req.body.pid]
  )
});

//Get all comments on a specific post
app.post("/post/comment/get", (req, res) => {
  
  base(res,
    "SELECT * from comment WHERE postid=?",
    [req.body.pid]
  )
});

//delete a comment
app.post("/post/comment/delete", (req, res) => {
  base(res,
    "DELETE FROM comment WHERE id=?",
    [req.body.cid]
  )
});

//Listen to port 5000
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
