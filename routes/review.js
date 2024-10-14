const express=require("express");
const router=express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapasync");
const ExpressError=require("../utils/ExpressError");
const { reviewSchema }=require("../schema.js");
const {isLoggedIn,validateReview,isAuthor}=require("../middleware");
const reviewController=require("../controllers/review");
//post review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))
//delete review
router.delete("/:reviewId",isLoggedIn,isAuthor,reviewController.destroyReview)

module.exports=router;