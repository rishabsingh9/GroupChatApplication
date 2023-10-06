const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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