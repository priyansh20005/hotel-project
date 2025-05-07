// dotenv -pacjkage to use .env file
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express=require("express");
const app = express();
let port = 8080;

// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

const path = require("path");
app.set("view engine"  , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname ,"/public")));

const methodOverride= require("method-override");
app.use(methodOverride("_method"));


const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;

const ejsMate=require("ejs-mate");
app.engine("ejs" , ejsMate);

// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");

// const {listingSchema ,reviewSchema} = require("./schema.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





// --------------------------establishing mongoose connection------------
async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
// ------------------------------------------------------------------

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        // secret:"mysupersecretcode"
           secret:process.env.SECRET
    },
    touchAfter:24*60*60 // in seconds
});

store.on("error" , ()=>{
    console.log("Error in mongo session Store " , err);
});

const sessionOptions = {
    store,
    // secret : "mysupersecretcode",
    secret: process.env.SECRET,
    resave:false , 
    saveUninitialized :true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000 ,
           // milisec of after 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};

// app.get("/" ,(req , res)=>{
//     res.send("HI i am ROOT");
// } );



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});


// app.get("/testListing" ,async (req , res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa" , 
//         description:"by the beach ",
//         price:1200 ,
//         location:"kolkata , WB",
//         country:"India"
//     });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfully testing ");
   
// });




// app.get("/demouser" , async(req,res)=>{
//     let fakeUser = new User({
//         email:"IqI3Y@example.com" ,
//         username:"testuser"
//     });

//     let  newUser =await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// });

// ----------------------USER routes----------------
const userRoutes = require("./routes/user.js");
app.use("/" , userRoutes);



///////////  --------LISTING routes-------------

const listingsRoute = require("./routes/listings.js");

app.use("/listings" , listingsRoute);



///--------------------REVIEW routes-------------
const reviewRoute = require("./routes/review.js");
app.use("/listings/:id/reviews" , reviewRoute);




// app.all("*" , (req , res, next)=>{
//     next(new ExpressError(404 , "page not found"));
// });



// error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode =500 , message ="something went wrong "} = err;
    // res.send("something went wrong!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err} );
});


app.listen(port , ()=>{
    console.log("server is listening to port 8080");
});