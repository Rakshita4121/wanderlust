const mongoose=require("mongoose");
let { data }=require("./data.js");
const Listing=require("../models/listing.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err)
})

const initDB= async()=>{
        await Listing.deleteMany({});
        data=data.map((obj)=>({...obj,owner:'67088d5c2147f748adf3e186'}))
        await Listing.insertMany(data);
        console.log("Data was initialized");
}
initDB();