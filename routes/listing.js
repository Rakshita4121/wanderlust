const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapasync");
const ExpressError=require("../utils/ExpressError");
const { listingSchema }=require("../schema.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware")
let listingController=require("../controllers/listing");
const multer=require("multer");
const {storage}=require("../cloudConfig");
const upload=multer({storage})

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))

router.get("/new",isLoggedIn,listingController.renderNewListingForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single('listing[image]'),isOwner,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports=router;