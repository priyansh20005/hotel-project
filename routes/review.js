const express = require("express");
const router = express.Router({mergeParams:true});

// const {listingSchema ,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {validateReview , isLoggedIn , isAuthor} = require("../middleware.js");


// post review route
router.post("/" ,isLoggedIn, wrapAsync(async(req,res , next)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);

    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    
    await review.save();
    await listing.save();
    req.flash("success" ,"new review added");
    console.log("new review saved");
    res.redirect("/listings/" + id);
}));

//delete review route
router.delete("/:reviewId", isLoggedIn , isAuthor ,wrapAsync( async(req,res,next)=>{
    
    let listingId = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(listingId ,{$pull: {reviews: reviewId}});

    req.flash("success","review deleted successfully");
    console.log("review deleted successfully");
    res.redirect("/listings/" + listingId);
}));

module.exports = router;