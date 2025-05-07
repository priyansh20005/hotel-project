const mongoose = require("mongoose");
const initData = require("./data.js");

const listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(MONGO_URL);
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
        owner:'6813804f325e7ffcace939ce'
        // adding owner to all listings 
    }));
    await listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();


