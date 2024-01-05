const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI, {});
const db = mongoose.connection;

db.on("error", () => {
  console.log("Connection Error");
});
db.once("open", () => {
  console.log("Connected to DB !");
});


module.exports = db