const { string } = require("joi");
const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new  mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number
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
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        let res=await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    console.log(listing)
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;