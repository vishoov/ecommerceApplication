const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
//     userID:string,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,

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
// Items:[{
// 	productID:string,
// 	Quantity:number,
// 	Price:number
// }]
totalAmount:{
    type:Number,
    required:true,
    min:[0, "Total amount cannot be negative"],
    default:0
},
// 	totalAmount:Number,
shippingAddress:{
    type:String,
    required:true
},
// 	shippingAddress:String,
status:{
    type:String,
    enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default:"Pending"
}
// 	Status:string,

}, {
    timestamps: true
})


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;