const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
//     	id:string,
// 	Name:string,
name:{
    type:String,
    required:true,
    trim:true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
    minLength:[2, "Product name should be at least 2 characters"]
},
// description:string,
description:{
    type:String,
    required:true,
    trim:true,
    maxLength:[500, "Product description cannot exceed 500 characters"],
    minLength:[10, "Product description should be at least 10 characters"]

},
// Costprice:number,
costPrice:{
    type:Number,
    required:true,
    min:[0, "Cost price cannot be negative"],
    
},
// saleprice:number,
salePrice:{
    type:Number,
    required:true,
    min:[0, "Sale price cannot be negative"],

},
// Category:string,
category:{
    type:String,
    required:true,
    trim:true,
    maxLength:[50, "Category cannot exceed 50 characters"],
    minLength:[2, "Category should be at least 2 characters"],
    enum:["Electronics", "Clothing", "Home Appliances", "Books", "Beauty Products", "Sports Equipment"],
    default:"Electronics"
},
// Stock:number,
stock:{
    type:Number,
    required:true,
    min:[0, "Stock cannot be negative"],
    default:0

},
// image:[String] -> cdn links front end
image:{
    //upload an image to a CDN and store the link here
    type:[String],
    required:false,
    validate:{
        validator:function(v){
            return v.length > 0; // Ensure at least one image link is provided

        },
        message:"At least one image link is required",
        validate: function(v){
            return v.every(link => typeof link === 'string' && link.trim() !== '');
        },
        message:"Please provide valid URLs for all images",
        validator: function(v) {
            return v.every(link => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(link));
        },
    },
} 
// createdAt:date


},
{ 
    timestamps:true,
    versionKey:false
})

productSchema.index(
    //we can use this index to search product faster 
    {
        name:"text",
        description:"text",
        category:"text"
    }
)


const Product = mongoose.model("Product", productSchema);


module.exports = Product;