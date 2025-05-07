const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema =  new Schema({
    title: {
        type:String,
        required: true
    }, 
    description:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String


        // type:String,
        // // default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlLk9mYa6d4a69Y5YTMUFDUaER76hZzkkRg&s" ,
        // set: (v)=>
        //     v==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlLk9mYa6d4a69Y5YTMUFDUaER76hZzkkRg&s" 
        //                 : v   // ternary operation
        
    },
    price:{
        type:Number , 
        minValue:1
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ] ,
    owner :{
        type:Schema.Types.ObjectId ,
        ref:"User"
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      }
});


// mongoose post middleware for deleting all reviews of that listing on its deltion

// const Review = require("./review.js");
// listingSchema.post("findOneAndDelete" , async(listing)=>{
//    if(listing){
//     await Review.deleteMany({_id : {$in: listing.reviews}});
//    }
// })


const Listing = mongoose.model("Listing" ,   listingSchema);
module.exports = Listing;