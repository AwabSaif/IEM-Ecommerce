const dotenv = require("dotenv").config();
const express = require("express");
const connectionDB = require("./DB/connectionDB");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const morgan = require('morgan');

const {authJwt  ,authErrorHandler}  = require("./middleWare/authMiddleWare");
const errorHandler = require( './middleWare/errerMiddleWare')
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");

const app = express();

app.use(cors());


//Middlewares
app.use(cookieParser()) 
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authErrorHandler);



//Routes Middleware
const api = process.env.API_URL;
app.use(`${api}/users`, userRoute)
app.use(`${api}/categories`, categoryRoute)
app.use(`${api}/products`, productRoute)



//Routes
app.get("/", (req, res) => {
  res.send("home page");
});

//Errer MiddleWare 
app.use(errorHandler);


// start server
const PORT = process.env.PORT ;

const server = app.listen(PORT, () => {
  try {
    console.log(`IEM Server Running on port ${PORT}...`);
  } catch (err) {
    console.log(err);
  }
});
