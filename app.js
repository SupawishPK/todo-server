const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb+srv://admin:adminpassword@cluster0.oo4xy.mongodb.net/mern-todo?retryWrites=true&w=majority"
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  console.log(hash);
  const newUser = new User({
    username: req.body.username,
    password: hash,
  });

  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        title: "error",
        error: "username already in use",
      });
    }
    return res.status(200).json({
      title: "use successfully added",
    });
  });
});

app.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    if (!user) {
      return res.status(400).json({
        title: "user is not found",
        error: "invalid username or password",
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      let token = jwt.sign({ userId: user._id }, "secretkey");
      return res.status(200).json({
        title: "login successful",
        token: token,
      });
    } else {
      return res.status(401).json({
        title: "login fail",
        error: "invalid username or password",
      });
    }
    //authentication is done, give them a token
  });
});

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log("Server running on port: ", port);
});
