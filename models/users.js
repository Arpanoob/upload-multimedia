const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({userName:String,password:String,email:String,profilePic:Object})
const userModel= mongoose.model('User', userSchema);
module.exports=userModel;