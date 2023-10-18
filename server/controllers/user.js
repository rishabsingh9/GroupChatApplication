const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const sequelize = require("../util/database");
const { Op } = require('sequelize');

exports.signUp = async (req, res, next) => {
    const { name, email,phonenumber, password } = req.body;
    try {
      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Error hashing password",
          });
        }
  
        try {
          const data = await User.create({ name, email,phonenumber, password: hash });
          res.status(201).json({ newUsers: data });
        } catch (err) {
          // Check if the error is a unique constraint violation
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
              error: "Email address already exists. Please use a different email.",
            });
          } else {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  
function generateAccessToken(id,name,isPremiumUser){
  return jwt.sign({userId:id,name:name},'secretkey')
  }
  
  exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const data = await User.findAll({ where: { email } });
      if (data.length > 0) {
        bcrypt.compare(password, data[0].password, (err, result) => {
          if (err) {
            throw new Error("Something went wrong");
          }
          if (result == true) {
            res
              .status(200)
              .json({ success: true, message: "User logged in successfully" ,token:generateAccessToken(data[0].id,data[0].name,)});
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Incorrect Password" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User Doesn't Exist" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  exports.getUsers=async(req,res,next)=>{
    try {
      const users=await User.findAll();
      let len=users.length;
      //console.log(users[0].name);
      let names=[];
      names[0]=req.user.id;
      for(let i=0;i<len;i++){
        let id=users[i].id;
        names[id]=users[i].name;
      }

      res.status(200).json({namesArr:names});
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }
exports.getAllUsers=async(req,res,next)=>{
  const userIdToExclude=req.user.id;

  try {
    const data=await User.findAll();
    const filteredUsers = data.filter((user) => user.id !== userIdToExclude);
    
    res.status(200).json({allusers:filteredUsers});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}


exports.getUser = async (req, res, next) => {
  try {
      const input = req.query.input; // This should be either an email or a phone number
      console.log(input);

      if (input) {
        const data = await User.findOne({
          where: {
              [Op.or]: [
                  { email: input },
                  { phonenumber: input }
              ]
          }
      });
          console.log('User Data:', data);

          if (data) {
              res.status(200).json({ user: data });
          } else {
              res.status(404).json({ message: 'User not found' });
          }
      } else {
          res.status(400).json({ message: 'Invalid input' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({
          error: err,
      });
  }
}
