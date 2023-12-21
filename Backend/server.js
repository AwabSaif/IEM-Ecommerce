const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require('./middleWare/errerMiddleWare')
const cookieParser = require("cookie-parser")


const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


//Routes Middleware
app.use("/api/user", userRoute)


//Routes
app.get("/", (req, res) => {
  res.send("home page");
});

//Errer MiddleWare 
app.use(errorHandler);

//Connrct to DB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {});
const db = mongoose.connection;

db.on("error", () => {
  console.log("Connection Error");
});
db.once("open", () => {
  console.log("Connected to DB !");
});

const server = app.listen(PORT, () => {
  try {
    console.log(`IEM Server Running on port ${PORT}...`);
  } catch (err) {
    console.log(err);
  }
});
