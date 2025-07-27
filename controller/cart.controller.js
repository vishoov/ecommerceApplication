const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        // Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).send("Quantity must be greater than 0");
        }

        // Validate productId
        if (!productId) {
            return res.status(400).send("Product ID is required");
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        const productPrice = product.salePrice;

        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if the product already exists in the cart
            const productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId.toString()
            );

            if (productIndex > -1) {
                // Update quantity and price
                cart.products[productIndex].quantity += quantity;
                cart.products[productIndex].price = productPrice;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    quantity,
                    price: productPrice
                });
            }

            // Recalculate totalAmount
            cart.totalAmount = cart.products.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );

            await cart.save();
            return res.status(200).send({
                message: "Product added to cart successfully",
                cart
            });
        } else {
            // Create new cart
            const newCart = new Cart({
                userId,
                products: [
                    {
                        productId,
                        quantity,
                        price: productPrice
                    }
                ],
                totalAmount: productPrice * quantity
            });
            await newCart.save();
            return res.status(201).send({
                message: "Cart created successfully",
                cart: newCart
            });
        }
    } catch (err) {
        console.error("Error in addToCart:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const deleteFromCart = async (req, res)=>{
    try{
        const { userId } = req.params;
        const { productId } = req.body;

        // Validate productId
        if(!productId){
            return res.status(400).send("Product ID is required to delete from cart");
        }

        //to find the cart for a specific user, we can directly use the userId
        const cart = await Cart.findOne({ userId });

        if(!cart){
            return res.status(404).send("Cart not found for this user");
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            p=> p.productId.toString() === productId.toString()
        )

        if(productIndex === -1){
            return res.status(404).send("Product not found in the cart");
        }


        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        //recalculate total Amount
        cart.totalAmount = cart.products.reduce(
            (sum, item) => sum + item.price*item.quantity, 0
        )

        await cart.save();

        return res.status(200).send({
            message: "Product removed from cart successfully",
            cart
        });
    }
    catch(err){
        console.error("Error in deleteFromCart:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

    const getCart = async (req, res)=>{
        try{
            const { userId } = req.params;
            
            // Validate userId
            if(!userId){
                return res.status(400).send("User ID is required to fetch cart");
            }

            const cart = await Cart.findOne({userId})


            if(!cart){
                return res.status(404).send("Cart not found for this user");
            }

            return res.status(200).send({
                message: "Cart fetched successfully",
                cart
            })

        }
        catch(err){
            console.error("Error in getCart:", err.message);
            res.status(500).send(err.message || "Internal Server Error");
        }
    }


module.exports = {
    addToCart,
    deleteFromCart,
    getCart
}