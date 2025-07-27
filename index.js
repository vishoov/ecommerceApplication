//Dependancies and imports

const express = require("express");
const app = express();

//Routes imports are here
const userRoutes = require("./view/user.routes")
const productRoutes = require("./view/product.routes");
const cartRoutes = require("./view/cart.routes");
const orderRoutes = require("./view/order.routes");
const reviewRoutes = require("./view/review.routes");


const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); //this loads the environment variables from .env file
const logger = require("./utils/logger.middleware")
const connectDB = require("./utils/connect.db");
const rateLimit = require("./utils/rateLimit.middleware");
const helmet = require("helmet");
const cors = require("cors");

//Database Connection

connectDB()

//MIDDLEWARES
app.use(express.json())

//Middleware for Logging

app.use(logger)

const corsOptions = {
    origin:"*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"

}


app.use(cors(corsOptions)) //CORS Middleware


app.use(rateLimit) //Rate Limiting Middleware
app.use(helmet()); //Helmet Middleware for security headers
//Route Management
app.get("/", async (req, res)=>{
    try{
        res.status(200).send("Welcome to the E-Commerce Application")
    }
    catch(err){
        console.error("Error in GET /:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
})






//Microservice Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);


//Deployment and Server Start
app.listen(3000, ()=>{
    try{
        console.log("Server is running on port 3000")
    }
    catch(err){
        console.error("Error starting the server:", err.message)
    }
})