//dev dependencies
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

//db dependencies
// const Url = require("./models/url");
const userRoute = require("./routes/user.route");
const exerciseRoute = require("./routes/exercise.route");
//node dependencies
const path = require("path");

//initialize express
const app = express();

//require dotenv to get env variables
// require("dotenv").config();

const MONGO_URI = 'mongodb+srv://azax:azax25547@cluster0.boqld.mongodb.net/test?retryWrites=true&w=majority'

//express middlewares
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const absolutepath = path.join(__dirname, "/static");
app.use(express.static(absolutepath));

//MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/exercise", userRoute);
app.use("/api/exercise", exerciseRoute);

//PORT
const PORT = process.env.PORT || 3000;

//routes

app.listen(PORT, () => {
  console.log("Server started Successfully");
});
