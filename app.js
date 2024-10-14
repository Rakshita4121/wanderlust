if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.use(methodOverride("_method"));
const path=require("path");
app.set("view enjine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.engine("ejs",ejsMate);
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions))
app.use(flash())
const ExpressError=require("./utils/ExpressError");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listings=require("./routes/listing");
const reviews=require("./routes/review");
const users=require("./routes/user");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err)
})
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.updateMsg=req.flash("update")
    res.locals.deleteMsg=req.flash("delete")
    res.locals.errorMsg=req.flash("error")
    res.locals.currUser=req.user;
    next();
})
// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-stud"
//     })
//     let demouser=await User.register(fakeuser,"rakshitaqwerty");
//     res.send(demouser);
// })
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.all("*",(req,res)=>{
    throw new ExpressError(404,"page not found");
})
app.use((err,req,res,next)=>{
    let {statuscode=500,message}=err;
    res.status(statuscode).render("error.ejs",{err});
})
app.listen(3037,()=>{
    console.log("listening to port 3037")
})


