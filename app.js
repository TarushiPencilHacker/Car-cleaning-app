const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./router/userRouter");

//my routes
const authRoutes = require("./router/auth");
const userRoutes = require("./router/userRouter");

//DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/pencilhacker")
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Port
const port = process.env.PORT || 4000;

//Middleware
var jsonParser = bodyParser.json();
var urlencoderParser = bodyParser.urlencoded({ extended: true });
app.use(cookieParser());
app.use(cors());
app.use(jsonParser);
app.use(express.json());

//Routes
app.use("/api", jsonParser, urlencoderParser, authRouter);
app.use("/api", jsonParser, urlencoderParser, userRouter);
app.use("/api/user", userRouter);

module.exports = app;
