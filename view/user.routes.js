const express = require("express");
const Router = express.Router();
const User = require("../model/user.model");
const { signup, login, logout, updatePassword, profile } = require("../controller/user.controller");
const { verifyToken } = require("../utils/jwt.security")


Router.get("/", async (req, res)=>{
    try{
        const users = await User.find();

        res.status(200).json({
            data:users
        })
    }
    catch(err){
        console.error("Error in GET /users:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
})

Router.post("/signup", signup)
Router.post("/login", login)
Router.get("/profile/:id", verifyToken, profile)
Router.put("/update-password/:id", updatePassword)



module.exports = Router;