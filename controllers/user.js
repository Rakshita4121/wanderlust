const User=require("../models/user");
 module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username})
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To WanderLust");
            res.redirect("/listings");
        })
    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");
    }
  
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to WanderLust");
    if(! res.locals.redirectUrl){
        res.locals.redirectUrl="/listings";
        return res.redirect(res.locals.redirectUrl);

    }
    let id,reviewId;
    const reviewUrlPattern = /\/listings\/(\w+)\/reviews\/(\w+)(\?_method=DELETE)?/;
    const match = res.locals.redirectUrl.match(reviewUrlPattern);
        
        if (match) {
            id = match[1];
            reviewId=match[2];
        }
   
    if(res.locals.redirectUrl==`/listings/${id}/reviews/${reviewId}?_method=DELETE`){
        res.locals.redirectUrl=`/listings/${id}`
    }
   
    console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl);
}
module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out"); // Set the flash message
        res.redirect("/listings"); // Redirect after setting the message
    });
}