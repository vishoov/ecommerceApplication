const router = require("express").Router();


const { createReview, getReviews, deleteReview } = require("../controller/review.controller");

router.post("/:productId", createReview);
router.get("/:productId", getReviews);
router.delete("/:reviewId", deleteReview);

module.exports = router;