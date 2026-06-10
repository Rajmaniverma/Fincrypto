import mongoose from "mongoose";

const userschema = mongoose.Schema({
    Company_name:{
        type:String,
        required:true
    },
    Graph:{
        type:String,
        required:true
    },
    Candle:{
        type:String,
        required:true
    }
    
} ,
{
    timestamps:true
})

const User =
  mongoose.models.user ||
  mongoose.model("user", userschema);

export default User;