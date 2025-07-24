const mongoose = require("mongoose");

const initData = require("./data.js");

const listing = require("../models/listing.js");


main().then(
    console.log("database connected")
).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const intDB = async() =>{

    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj , owner: '68679d52122b75628f8f7786' }))
    await listing.insertMany(initData.data);

    console.log("data was initialized");

}

intDB();