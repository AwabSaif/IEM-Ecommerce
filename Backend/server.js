const dotenv = require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParer = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

//Connrct to DB and start server

mongoose.connect(process.env.MONGODB_URI, {
   
  });
const db = mongoose.connection;

db.on('error',()=>{
    console.log("Connection Error");
})
db.once('open',()=>{
    console.log("Connected to DB !");
})

app.listen(PORT,()=>{
    try {
        console.log(`IEM Server Running on port ${PORT}...`);
        
    } catch (err) {
        console.log(err);
    }
})
