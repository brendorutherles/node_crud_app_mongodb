// In this file we have create Schema of table for user registration 

// import mongoos here 
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    gender:{
        type:String, 
        // require:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now,
    },
});

module.exports = mongoose.model("User",userSchema);