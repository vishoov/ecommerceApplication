const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
//     userID:string,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
},
products:[
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        price:{
            type:Number, 
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
            min:[1, "Quantity must be at least 1"],
            default:1

        }
    }
],
totalAmount:{
    type:Number,
    required:true,
    min:[0, "Total amount cannot be negative"],
    default:0
}
// Products:[{
// productId: string,
// Price:number,
// quantity:number	
// }],
// totalAmount:number

}, {
    timestamps: true
})


const Cart = mongoose.model("Cart", cartSchema);


module.exports = Cart;