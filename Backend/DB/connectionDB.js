const mongoose = require("mongoose"); // Import mongoose for MongoDB interaction

// Connect to MongoDB using the provided URI from environment variables
mongoose.connect(process.env.MONGODB_URI, {}); 

const db = mongoose.connection; // Get the database connection instance

// Event handler for database connection error
db.on("error", () => {
  console.log("Connection Error"); // Log error if connection fails
});

// Event handler for successful database connection
db.once("open", () => {
  console.log("Connected to DB !"); // Log success message once connected
});

module.exports = db; // Export the database connection instance
