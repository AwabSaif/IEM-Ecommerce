// Import required modules
const dotenv = require("dotenv").config(); // Load environment variables
const express = require("express"); // Express framework
const connectionDB = require("./DB/connectionDB"); // Database connection
const bodyParser = require("body-parser"); // Parse incoming request bodies
const cors = require("cors"); // Cross-Origin Resource Sharing
const cookieParser = require("cookie-parser"); // Parse cookie headers
const morgan = require("morgan"); // HTTP request logger

// Import middleware
const { authJwt, authErrorHandler } = require("./middleWare/authMiddleWare"); // JWT authentication middleware
const errorHandler = require("./middleWare/errerMiddleWare"); // Error handling middleware

// Import routes
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const contactUsRoute = require("./routes/contactUsRoute");

// Initialize Express application
const app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://iemecommerce.onrender.com",
      "https://ieme-commerce.netlify.app",
    ],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser()); // Parse cookie headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan("tiny")); // Log HTTP requests
app.use(authJwt()); // JWT authentication
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(authErrorHandler); // Authentication error handler
app.use("/public/uploads", express.static(__dirname + "/public/uploads")); // Serve static files

// Routes middleware
const api = process.env.API_URL; // API base URL
app.use(`${api}/users`, userRoute);
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/products`, productRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/iem-contact-us`, contactUsRoute);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT; // Port number
const server = app.listen(PORT, () => {
  try {
    console.log(`IEM Server Running on port ${PORT}...`);
  } catch (err) {
    console.log(err);
  }
});
