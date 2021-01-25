const express = require("express");
const Router = express.Router();
const common = require("../dbconnection/common");
const bodyParser = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());

//Add comment by a User
Router.post("/add", (req, res) => {
    const data = {
      comment: req.body.comment,
      commenter: req.body.uid,
      postid: req.body.pid,
    };
    common.base(res,
      "INSERT into comment SET?",
        data,
    )
  });
  
   //Get all comments on a specific post
   Router.post("/get", (req, res) => {
    
    common.base(res,
      "SELECT * from comment WHERE postid=?",
      [req.body.pid]
    )
  });

  //Get all comments by a specific user on a specific post
  Router.post("/getallbyuser", (req, res) => {
    common.base(res,
      "SELECT comment from comment WHERE commenter=? and postid=?",
      [req.body.uid, req.body.pid]
    )
  });
   
  //delete a comment
  Router.post("/delete", (req, res) => {
    common.base(res,
      "DELETE FROM comment WHERE id=?",
      [req.body.cid]
    )
  });

module.exports = Router
