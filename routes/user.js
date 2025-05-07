const passport = require("passport");
const User = require("../models/user.js");

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");


router.route("/signup" )
    .get((req,res)=>{
        res.render("users/signup.ejs");
    })

     .post( wrapAsync(async(req,res)=>{
      try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
         registeredUser = await User.register(newUser , password);
         req.flash("success" , "Welcome to Wanderlust");
    
         // directly login after signing up
         req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        } 
        console.log("user registered --->"  + registeredUser.username +"\n"+registeredUser.email  +"\n"+ registeredUser._id);
        res.redirect("/listings");
         }) ;
        }
         catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
         }
        }));



router.route("/login" )
    // login 
    .get( (req,res)=>{
         console.log("login req received");
         res.render("users/login.ejs");
    })

    // post login 
    .post(
         saveRedirectUrl ,
         passport.authenticate("local" , {failureRedirect:"/login" , failureFlash:true}) ,
        // middleware to check whether user is registered  or not
         async(req,res)=>{
        req.flash("success" ,"Login successfully");
        console.log("user logged in");

         // res.redirect("/listings");
        let redirectUrl = res.locals.redirectUrl || "/listings" ;
        res.redirect(redirectUrl);

    });

router.get("/logout" , (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success" , "Logged out successfully");
            console.log("user logged out");
            res.redirect("/listings");
        }
    })
});

module.exports = router;