const Listing=require("../models/listing");
module.exports.index=async (req,res)=>{
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}
module.exports.renderNewListingForm=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
}
module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path
    let filename=req.file.filename
    let listing=req.body.listing;
    const newListing= new Listing(listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Listing created successfully")
    res.redirect("/listings");

}
module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(! listing){
        req.flash("error","Listing you requested for doesnot exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.renderEditForm=async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    if(! listing){
        req.flash("error","Listing you want to edit doesnot exist")
        return res.redirect("/listings")
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing);

    if(typeof req.file !== "undefined"){
        let url=req.file.path
        let filename=req.file.filename
        listing.image={url,filename}
        await listing.save()
    }
   
    req.flash("update","Listing updated successfully")
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("delete","Listing deleted successfully")
    res.redirect(`/listings`);
}