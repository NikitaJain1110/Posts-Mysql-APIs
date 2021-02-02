const mysql = require("mysql");

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

  module.exports = {base, pool}