const express= require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const common = require("../utils/common");
const jwt = require("jsonwebtoken")

const bodyParser = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());

//Create user
Router.post("/create", async (req, res, next) => {
  const { username, password } = await req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const data = {
    username: username,
    password: hashedPassword,
  };
  common.base(res, "INSERT INTO user SET ?", [data]);
});

// //login
// Router.post("/login", async (req,res)=>{
//   const user = common.pool.getConnection((err,conn)=>{
//     if (err) throw err
//     const user = conn.query("SELECT * from user WHERE user=?",[req.body.username])
//     if (user == null){
//       return res.send("Oops! User does not exist.")
//     }
//     try{
//       if (await bcrypt.compare(req.body.password, user.password)){
//         res.send("Login success")
//       }else{
//         res.send('Not allowed')
//       }
//     }catch{
//       res.send()
//     }
//   })
//   console.log(user)
// })


// //JWT
// Router.get('/login',(req, res)=>{
  
// })


//Get user by username
Router.post("/getbyusername", async (req, res) => {
  const { username } = req.body;
  
    const response = await common.base(
      res,
      "SELECT * from user WHERE username=?",
      [req.body.username]
    );
});

//Get user by username
Router.post("/get", async (req, res) => {
    
      const response = await common.base(
        res,
        "SELECT * from user ",
        
      );
  });

module.exports = Router;
