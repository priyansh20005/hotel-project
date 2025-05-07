const mongoose = require("mongoose");
const {Schema} = mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({

    email:{
        type:String,
        required:true
    },
    // name:{
    //     type:String,

    // }

    // username and password are already present 
    // in passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);