const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({text:String,password:String,pri:String,todopic:String,status:Boolean})
const todoModel= mongoose.model('Todo', userSchema);
module.exports=todoModel;