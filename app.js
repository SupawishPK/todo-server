const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const Todo = require("./models/Todo");
const bcrypt = require("bcrypt");
const requireToken = require("./utils/RequireToken");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGOOSE_PASSWORD}@cluster0.oo4xy.mongodb.net/${process.env.MONGOOSE_PROJECT}?retryWrites=true&w=majority`
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
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
      //authentication is done, give them a token
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
  });
});

//get todo route
app.get("/todos", requireToken, (req, res) => {
  const userId = req.userId;
  // token is valid
  Todo.find({ author: userId }, (err, todos) => {
    if (err) console.log(err);
    return res.status(200).json({
      title: "success",
      todos: todos,
    });
  });
});

app.post("/todo", requireToken, (req, res) => {
  //logging userId from function requireToken
  const userId = req.userId;

  let newTodo = new Todo({
    title: req.body.title,
    isCompleted: false,
    author: userId,
  });

  newTodo.save((error) => {
    if (error) return console.log(error);
    return res.status(200).json({
      title: "successfully added",
      todo: newTodo,
    });
  });
});

app.get("/user", requireToken, (req, res) => {
  //logging userId from function requireToken
  const userId = req.userId;

  User.findOne({ _id: userId }, (err, user) => {
    if (err) console.log(err);
    return res.status(200).json({
      title: "success",
      user: {
        username: user.username,
      },
    });
  });
});

app.put("/todo/:todoId", requireToken, (req, res) => {
  //logging userId from function requireToken
  const userId = req.userId;

  Todo.findOne({ author: userId, _id: req.params.todoId }, (err, todo) => {
    if (err) console.log(err);

    todo.isCompleted = true;
    todo.save((error) => {
      if (error) console.log(error);
      //saved
      return res.status(200).json({
        title: "success",
        todo: todo,
      });
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log("Server running on port: ", port);
});
