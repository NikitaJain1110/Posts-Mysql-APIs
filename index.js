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
  database: "user_post",
});

//Create user
app.post("/user", async (req, res, next) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const data = {
    username: username,
    password: hashedPassword,
  };
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    let query = connection.query(
      "INSERT INTO user SET ?",
      data,
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log(rows);
        res.json(rows);
      }
    );
  });
});

//Get user by username
app.get("/:username", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.query(
      "SELECT * from user WHERE username=?",
      [req.params.username],
      (err, rows) => {
        connection.release(); // return the connection to pool

        if (err) console.log(err);
        console.log(rows);
        res.json(rows);
      }
    );
  });
});

//Create Posts
app.post("/post/:uid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      content: req.body.content,
      userid: req.params.uid,
    };
    let query = connection.query(
      "INSERT INTO post SET ?",
      data,
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log(rows);
        res.json(rows);
      }
    );
  });
});

//Delete post
app.delete("/post/:pid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      id: req.params.pid,
    };
    let query = connection.query(
      "DELETE post, comment from post inner join comment on post.id=comment.postid WHERE post.id= ?",
      [req.params.pid],
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log("delete entry-" + rows);
        res.json(rows);
      }
    );
  });
});

//Update post
app.patch("/post/:pid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      id: req.params.pid,
      content: req.body.content,
    };
    let query = connection.query(
      "UPDATE `post` SET `content`=? WHERE `id`=?",
      [req.body.content, req.params.pid],
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log("updated entry-" + rows);
        res.json(rows);
      }
    );
  });
});

//??????????Get all posts?????????
app.get("/post",async (req, res) => {
 let x= await pool.getConnection(async (err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    //connection.query("SELECT * FROM `post`", (err, rows) => {
     let query = await connection.query("SELECT post.content, user.username FROM post join user on post.userid=user.id", (err, rows) => {
      // connection.release();
      if (err) throw err;
      console.log(rows);
      res.json(rows);
    });
  });
});

//Get all posts of a User
app.get("/post/:uid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);

    connection.query(
      "SELECT content from post WHERE userid=? ",
      [req.params.uid],
      (err, rows, fields) => {
        connection.release();

        if (err) console.log(err);
        //iterate for all rows in the rows object
        Object.keys(rows).forEach((key) => {
          var row = rows[key];
          console.log(row.content);
          // console.log(JSON.stringify(row.content));
        });
        res.json(rows);
      }
    );
  });
});

//Add comment by a User
app.post("/post/comment/:pid/:uid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      comment: req.body.comment,
      commenter: req.params.uid,
      postid: req.params.pid,
    };
    let query1 = connection.query(
      "INSERT into comment SET?",
      data,
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log("inserted entry-" + rows);
        res.json(JSON.stringify(rows));
      }
    );
  });
});

//Get all comments by a specific user on a specific post
app.get("/post/comment/:pid/:uid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      commenter: req.params.uid,
      postid: req.params.pid,
    };
    let query1 = connection.query(
      "SELECT comment from comment WHERE commenter=? and postid=?",
      [req.params.uid, req.params.pid],
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log(rows);
        res.json(rows);
      }
    );
  });
});

//Get all comments on a specific post
app.get("/post/comment/:pid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      commenter: req.params.uid,
      postid: req.params.pid,
    };
    let query1 = connection.query(
      "SELECT comment from comment WHERE postid=?",
      [req.params.pid],
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log(rows);
        res.json(JSON.stringify(rows));
      }
    );
  });
});

//delete a comment
app.delete("/post/comment/:cid", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    const data = {
      id: req.params.cid,
    };
    let query = connection.query(
      "DELETE from comment WHERE ?",
      data,
      (err, rows) => {
        connection.release();

        if (err) console.log(err);
        console.log("delete entry-" + rows);
        res.json(rows);
      }
    );
  });
});

//Listen to port 5000
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
