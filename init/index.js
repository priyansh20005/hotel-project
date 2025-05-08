const mongoose = require("mongoose");
const initData = require("./data.js");

const listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect("mongodb+srv://priyanshkoshtics23:QbmdRcs1UNzE2SaZ@cluster0.8u5whfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

const initDB = async()=>{
    await listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({
        ...obj,
        owner:'681b9a7a8d3360987bd78a6e',
        // adding owner to all listings
        geometry:{type:'Point' , coordinates:[18.6435, 60.1282]} ,
    }
    ));
        
    await listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();


