const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    // id:{
    //     type:String,
    //     unique:true,
    // },
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
    password:{
        type :String,
        required:true,
        min:[6,"Must have atleast 6 character"],
        max:10,
    },
    confirmPassword:{
        type:String,
        required:true,
        min:[6,"Must have atleast 6 character"],
        max:10,
    },
    active:{
        type:Boolean,
        default:true,
    },
    approved:{
        type:Boolean,
        default: true,
    },
    accountType:{
        type:String,
        enum:["Admin","Instructor","Student"],
        required : true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    image:{
        type:String,
        required:true,
    }
},{ timestamps: true });

module.exports = mongoose.model("User",userSchema);