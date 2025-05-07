const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const {validateListing} = require("../middleware.js");

const {storage} = require("../cloudconfig.js");

const multer = require("multer");
const upload = multer({storage});

// geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient  = mbxGeocoding({ accessToken: mapToken });


//middleware to check if user is logged in
const {isLoggedIn , isOwner} = require("../middleware.js");



router;


// router.route  -> same path diff methpods
router.route("/")

    // //index route -all listings
    .get( wrapAsync (async(req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
    }))

    // post add  / CREATE route
    .post( isLoggedIn,  upload.single('listing[image]') , 
         wrapAsync (async(req , res)=>{
    

           let response = await geocodingClient.forwardGeocode({
                // query: 'New Delhi , India',
                  query: req.body.location,
                limit: 1
              })
                .send();
            
                // console.log(response.body.features[0].geometry);

            // url of uploaded image
        let url = req.file.path;
        let filename = req.file.filename;
       
    
        let newListing = new Listing(req.body);
           newListing.image ={url , filename};
        // res.send(newListing);
        newListing.owner = req.user._id;
        // console.log(req.user);
        newListing.geometry=response.body.features[0].geometry;
        await newListing.save();
    
        console.log("successfully added new listing");  
        req.flash("success" , "listing added successfully");
        res.redirect("/listings");
    
    }))


   

// adding new listing -route
router.get("/new" ,isLoggedIn , (req , res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
    });


router.route("/:id")
    // show route
    .get( wrapAsync (async (req , res)=>{
         let id =req.params.id;
        let listing = await Listing.findById(id)
                        .populate({
                            path:"reviews" ,
                             populate:{path:"author"}
                            }).populate("owner");
          if(!listing){
        req.flash("error" , "Listing you requested for does not exists");
        res.redirect("/listings");
         }
         console.log("searching successful for id :" + id );
         res.render("listings/show.ejs" , {listing});
    
        }) )

    // post/put update route 
    .put(isLoggedIn ,isOwner,
        upload.single("listing[image]"),
         wrapAsync(async(req , res)=>{
        
            let {id} = req.params;
            let listing= await Listing.findByIdAndUpdate(id , req.body , {new:true});
       
        if(typeof req.file !=="undefined"){    
        // url of uploaded image
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image={url,filename};
        await listing.save();
        }

         req.flash("success" ,"listings updated ");
         console.log("updated succesfully");
        res.redirect("/listings/" + id);
        }))

    // delete route 
    .delete( isLoggedIn, isOwner, wrapAsync(async(req , res)=>{
    let id = req.params.id;
    let listing= await Listing.findByIdAndDelete(id);

    for(let review of listing.reviews){
        await Review.findByIdAndDelete(review);
    }

    req.flash("success" , "listing deleted successfully");
    console.log("listing & its reviews deleted successfully ");
    res.redirect("/listings");
    }));




// get edit route
router.get("/:id/edit",isLoggedIn, isOwner , wrapAsync(async(req , res)=>{

    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested for does not exists");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload" ,"/upload/h_300,w_250");
    console.log("edit request received ");
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
}));





module.exports = router;