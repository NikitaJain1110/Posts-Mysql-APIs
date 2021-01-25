const express = require("express");
const Router = express.Router();
const common = require("../dbconnection/common");
const bodyParser = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());

//Create Posts
Router.post("/create",(req, res) => {
  data={
      content:req.body.content,
      userid:req.body.userid
  }
   common.base(res,
      "INSERT INTO post SET ?",
      data
    )
  });

//Delete post
Router.post("/delete",(req, res) => {
    common.base(res,
      "DELETE post, comment from post left join comment on post.id=comment.postid WHERE post.id= ?",
        [req.body.pid]
    )
  });
  
  //Update post
  Router.post("/update", (req, res) => {
    common.base(res,
      "UPDATE `post` SET content=? WHERE id=?",
      [req.body.content,req.body.pid]
    )
  });
  
  //Get all posts
  Router.post("/get",(req, res) => {
    common.base(res,
      "SELECT post.*, user.username FROM post join user on post.userid=user.id",
      []
    )
  });
  
  //Get all posts of a User
  Router.post("/getallofuser", (req, res) => {
    common.base(res,
      "SELECT content from post WHERE userid=?",
      [req.body.uid]
    )
  });

module.exports = Router

  