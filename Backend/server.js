const dotenv = require("dotenv").config();
const express = require("express");
const connectionDB = require("./DB/connectionDB");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { authJwt, authErrorHandler } = require("./middleWare/authMiddleWare");
const errorHandler = require("./middleWare/errerMiddleWare");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const contactUsRoute = require("./routes/contactUsRoute");

const app = express();

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, //لاتنسى اضافة اسم السيفير او الدومين في النشر
}));

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authErrorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//Routes Middleware
const api = process.env.API_URL;
app.use(`${api}/users`, userRoute);
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/products`, productRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/iem-contact-us`, contactUsRoute);

//Routes
/* app.get("/", (req, res) => {
  //   res.send("home page");
    res.sendFile(__dirname +"/public/index.html")
  });
   */
app.get("/", (req, res) => {
  res.send("home page");
});

//Errer MiddleWare
app.use(errorHandler);

// start server
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  try {
    console.log(`IEM Server Running on port ${PORT}...`);
  } catch (err) {
    console.log(err);
  }
});
