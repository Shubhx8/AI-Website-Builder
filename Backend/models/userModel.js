import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default: ""
    },
    password:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
    },
    otpExpires:{
        type:Date,
    },
    credits:{
        type:Number,
        default:100,
        min:0,
    },
    plan:{
        type:String,
        enum:["free","pro","enterprise"], default:"free",
    }
    }, { timestamps: true });

export const User = mongoose.model("User",userschema);