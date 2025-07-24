const { model } = require("mongoose");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req,res)=>{ 
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    }
    
    res.render("listings/show.ejs", {listing} );
}

module.exports.createListing = async (req, res)=>{
    const newListing =  new Listing(req.body);
    const url = req.file.path;
    const fileName = req.file.filename;
    if(!req.body){
        throw new ExpressError(400, "send vaild listings");
    }
    newListing.owner = req.user._id;
    newListing.image = {url , fileName}
    await newListing.save();
    req.flash("success", "new Listing Created !")
    res.redirect("/listings");    
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!list) {
        req.flash("error", "Listing does not exist!")
        res.redirect("/listings")
    }

    let originalImgUrl = list.image.url;
    originalImgUrl =  originalImgUrl.replace("/upload", "/upload/h_150,w_250")

    res.render("listings/edit.ejs", {list, originalImgUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body});

    if(typeof req.file !== "undefined"){
    const url = req.file.path;
    const fileName = req.file.filename;
    listing.image = {url , fileName}
    await listing.save();
    }

    req.flash("success", "Listing Updated !")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !")
    res.redirect("/listings");  
}