const Cart = require("../model/cart.model");
const Order = require("../model/orders.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");

const createOrder = async (req, res)=>{
    try{
        const { userId } = req.params;
        
        // Validate userId
        if(!userId){
            return res.status(400).send("User ID is required");
        }




        //find a cart through which the order will be placed
        const cart = await Cart.findOne({userId });

        if(!cart){
            return res.status(404).send("Cart not found for this user");
        }

        //check the product availibility
        if(cart.products.length === 0){
            return res.status(400).send("Cart is empty, cannot create order");
        }else{
            //find if the products are in stock 
            for(const item of cart.products){
                const product = await Product.findById(item.productId);

                if(product.stock <item.quantity){
                    return res.status(400).send(`Product ${product.name} is out of stock`);
                }
            }
        }

        //find the shipping address of the user

        const user = await User.findOne({_id: userId});

        const shippingAddress = user.address;

        // Create a new order
        const order = new Order({
            userId,
            products:cart.products,
            totalAmount:cart.totalAmount,
            shippingAddress: shippingAddress,
            status: "Pending"
        })

        // Save the order
        await order.save();
        // Clear the cart after order creation
        await Cart.findByIdAndDelete(cart._id);

        return res.status(201).send({
            message: "Order created successfully",
            order
        });
    }
    catch(err){
        console.error("Error in createOrder:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const cancelOrder = async (req, res)=>{
    try{
        const { orderId } = req.params;

        if(!orderId){
            return res.status(400).send(
                "Order ID is required to cancel the order"
            )
        }

        // Find the order by ID
        const order = await Order.findOne({ _id: orderId });
        

        if(!order){
            return res.status(404).send("Order not found");
        }


        // Check if the order is already cancelled or completed
        if(order.status==="Cancelled" || order.status==="Completed"){
            return res.status(400).send("Order cannot be cancelled as it is already cancelled or completed");
        }

        // Update the order status to cancelled
        order.status="Cancelled";
        await order.save();

        return res.status(200).send({
            message: "Order cancelled successfully",
            order
        })


    }
    catch(err){
        console.error("Error in cancelOrder:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const trackOrder = async (req, res)=>{
    try{
        const { orderId }= req.params;

        if(!orderId){
            return res.status(400).send("Order ID is required to track the order");
        }

        //Find the order by Id
        const order = await Order.findOne({_id:orderId});

        if(!order){
            return res.status(404).send("Order not found");
        }

        // Return the order details
        return res.status(200).send({
            message: "Order details retrieved successfully",
            order
        })

    }
    catch(err){
        console.error("Error in trackOrder:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

module.exports = {
    createOrder,
    cancelOrder,
    trackOrder
}