const mongoose = require("mongoose");
const {Schema} = mongoose;


const reviewSchema  = new Schema({
    comment:{
        type:String , 
        required:true ,
        minLength:[1,"comment must be at least 1 character long"]
    },
    rating:{
        type:Number,
        required:true,
        min:[1 , "rating must be at least 1"],
        max:[5 , "rating must be at most 5"]
    },
    createdAt:{
        type: Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports =mongoose.model("Review" , reviewSchema);