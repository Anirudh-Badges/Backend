const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    id:{
        type:String,
        required: true,
        unique: true,
    },
    firstName:{
        type:String,
        required : true,
        trim: true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
    contactNumber:{
        type : Number,
        required:true,
    },
    password:{
        type :String,
        required:true,
        min:[6,"Must have atleast 6 character"],
        max:12,
    },
    confirmPassword:{
        type:String,
        required:true,
        min:[6,"Must have atleast 6 character"],
        max:12,
    },
    account_type:{
        type:String,
        enum:["Admin","Instructor","Student"],
        required : true
        
    },
    active:Boolean,
});

module.exports = mongoose.model("User",userSchema);