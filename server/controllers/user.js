const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');

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

  exports.getUser=async(req,res,next)=>{
    try {
      let id=req.params.id;
      const data=await User.findOne({id});
      res.status(200).json({user:data});
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }