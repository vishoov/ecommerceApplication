const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        min: [18, "You need to be 18 years of age"],
        max: [100, "You are too old to use this application"],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                return /(^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+[\.][a-z]+$)/.test(email);
            },
            message: "Please enter a valid email"
        }
    },
    address: {
        line1: {
            type: String,
            required: [true, "Address Line 1 is required"],
            trim: true,
            maxLength: [255, "Address Line 1 cannot exceed 255 characters"]
        },
        line2: {
            type: String,
            required: true,
            trim: true,
            maxLength: [255, "Address Line 2 cannot exceed 255 characters"]
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
            maxLength: [100, "City cannot exceed more than 100 characters"],
            minLength: [2, "The city name should be at least 2 characters"]
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
            maxLength: [100, "State cannot exceed more than 100 characters"]
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
            maxLength: [10, "Zip code cannot exceed 10 characters"]
        },
        country: {
            type: String,
            required: true,
            trim: true
        }
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Contact must be a 10 digit number"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "The password should be at least 8 characters"],
        maxLength: [16, "The password can be maximum 16 characters"],
        validate: {
            validator: function(password) {
                return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/.test(password)
            },
            message: "Password must contain at least 8 characters with at least one uppercase, lowercase, number, and symbol"
        }
    },
  
}, {
    timestamps: true,
    versionKey: false
});

//use a middleware to hash the password before saving the user 

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
       try{
        //salt is used to add randomness to the hash
        const salt = await bcrypt.genSalt(10);
        //genSalt(10) generates a salt with 10 rounds 
        //genSalt generates a salt and then hashes the password 
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password= hashedPassword;

        next();

       }
       catch(err){
        console.error("Error hashing password:", err.message);
        next(err);
       } 
    }
});


//create a method that will use bcrypt to compare the hashed password with the plain text password that the user provides during login
userSchema.methods.comparePassword = async function(plainPassword){
    try{
        //bcrypt.compare(plainPassword, this.password) is method to compare the plain text password with the hashed password
        return await bcrypt.compare(plainPassword, this.password);
    }
    catch(err){
        console.error("Error comparing password:", err.message);
        throw err;
    }

}


const User = mongoose.model("User", userSchema);

module.exports = User;
