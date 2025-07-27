const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Database connected successfully");
    }
    catch(err){
        console.error("Database connection failed:", err.message);
        throw new Error("Database connection failed");
    }
}

module.exports = connectDB;