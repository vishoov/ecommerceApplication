const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    // 	Id:string,
	// productId:string,
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
	// Rating:number,
    rating:{
        type:Number,
        required:true,
        mim:[1, "Rating must be at least 1"],
        max:[5, "Rating cannot be more than 5"]

    },
	// Userid:string,
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
	// Title:string,
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:[100, "Title cannot be more than 100 characters"]
    },
        
	// Description:string,
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:[500, "Description cannot be more than 500 characters"]
    },
	// Verifiedpurchase:boolean,
    verifiedPurchase:{
        type:Boolean,
        default:false
    },
	// Votes:number,
    votes:{
        type:Number,
        default:0
    },
    media:[
        {
            type:String,
            required:false
        }
    ]
	// Media:[string]

})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;