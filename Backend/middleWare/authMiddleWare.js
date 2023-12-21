const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler( async (req , res ,next) =>{
    try {
        const token = req.cookies.token
        if(!token){
            res.status(401)
            throw new Error("Not authorizd, please login")
        }
        // Verify token
        const verifed = jwt.verify(token, process.env.JWT_SECRET)
        // Get user id form token
        const  user = await User.findById(verifed.id).select("-password")

        if(!user){
            res.status(401)
            throw new Error("User not found!")
        }
        req.user = user;
        next()

    } catch (error) {
        res.status(401)
        throw new Error("Not authorizd, please login")
    }
})

module.exports = protect