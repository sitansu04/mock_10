const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//--------------------------Import Models and Auth----------------------->
const { auth } = require("../middlewares/auth.middleware");
const { Usermodel } = require("../models/user.model");

//--------------------------Route Created----------------------->
const userRoute = express.Router();

//------------------------------------User Route Testing----------------------->
userRoute.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: `User Route is Working` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

//------------------------------------User Registration------------------------->
userRoute.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ msg: `Please Fill all the Details` });
    }
    const ex_user = await Usermodel.findOne({ email: email });
    if (ex_user) {
      return res
        .status(400)
        .send({ msg: `Email already Exists Plaese try to login` });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: err.message });
        }
        if (hash) {
          const user = new Usermodel({
            username,
            email,
            password: hash,
          });
          await user.save();
          return res.status(201).send({ msg: `User Registered Successfully` });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

//------------------------------User Login------------------->
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ msg: `Please Fill All the Details` });
    }

    const ex_user = await Usermodel.findOne({ email: email });
    if (!ex_user) {
      return res
        .status(400)
        .send({ msg: `User Not found Please Register First` });
    } else {
      bcrypt.compare(password, ex_user.password, async (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: err.message });
        }

        if (isMatch) {
          const token = jwt.sign(
            { userID: ex_user._id, status: ex_user.status },
            "sitansu"
          );
          return res
            .status(201)
            .send({ msg: `User logged in successfull`, token: token });
        } else {
          return res.status(400).send({ msg: `Login Failed` });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});
//--------------------------check Auth-------------------->
userRoute.get("/checkAuth", auth, async (req, res) => {
  try {
    return res.status(200).send({ msg: `Auth working Successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = {
  userRoute,
};
