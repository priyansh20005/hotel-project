const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");


// checking whether user is logged in
module.exports.isLoggedIn = (req, res, next) =>{

    if( !req.isAuthenticated()){
        // checking whethre user is logged in

        req.session.redirectUrl = req.originalUrl;
        // bcuz after login sessions data will be deleted


        req.flash("error" , "You need to login first");
        return res.redirect("/login");
    }
    next();
};

// saving the url where user wwants to go after login
module.exports.saveRedirectUrl = (req,res , next)=>{
    
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
};


// cecking whether user is the owner of listing
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not allowed to edit this listing");
        return res.redirect("/listings/" + id);
    }
    next();
};

// cehcking whether the user is the author of review
module.exports.isAuthor = async(req,res , next)=>{
    let {reviewId } = req.params ;
    let review = await Review.findById(reviewId);

    if( ! review.author._id.equals(req.user._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect("/listings/" + req.params.id);
    }
    next();

}

const {listingSchema ,reviewSchema} = require("./schema.js");

// Joi function for server side validation of review
module.exports.validateReview = (req,res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

// joi function
module.exports.validateListing = (req,res, next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};