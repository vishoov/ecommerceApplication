const Review = require("../model/review.model");
const Order = require("../model/orders.model");

const createReview = async (req, res)=>{
    try{
        const { productId } = req.params;

        const { userId, rating, title, description } = req.body;
        let verifiedPurchase = false;
        // Validate required fields
        if(!productId || !userId || !rating || !title || !description){
            return res.status(400).send("Product ID, User ID, rating, title, and description are required");
        }

        //check if this is a valid purchase
        const order = await Order.findOne({userId, "products.productId": productId});

        if(!order){
            return res.status(400).send("This product was not purchased by the user, cannot create review");
        }else{
            verifiedPurchase = true;
        }

        // Create a new review

        const review = new Review({
            productId,
            userId,
            rating,
            title,
            description,
            verifiedPurchase
        });

        // Save the review
        await review.save();

        return res.status(201).send({
            message: "Review created successfully",
            review
        });

        
    
    }
    catch(err){
        console.error("Error in createReview:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

//fetch the reviews for a product
const getReviews = async (req, res)=>{
    try{
        const { productId } = req.params;

        if(!productId){
            return res.status(400).send("Product ID is required");
        }


        const reviews = await Review.find({productId})
            .populate("userId", "name email") // Populate user details
            .sort({ createdAt: -1 }); // Sort by creation date, most recent first
        
        if(reviews.length===0){
            return res.status(404).send("No reviews found for this product");
        }

        return res.status(200).send({
            message: "Reviews fetched successfully",
            reviews
        });
    }
    catch(err){
        console.error("Error in getReviews:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}


const deleteReview = async (req, res)=>{
    try{
        const { reviewId } = req.params;

        if(!reviewId){
            return res.status(400).send("Review ID is required");
        }

        const review = await Review.findByIdAndDelete(reviewId);

        if(!review){
            return res.status(404).send("Review not found");
        }

        return res.status(200).send({
            message: "Review deleted successfully",
            review
        });
    }
    catch(err){
        console.error("Error in deleteReview:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

module.exports = {
    createReview,
    getReviews,
    deleteReview
}