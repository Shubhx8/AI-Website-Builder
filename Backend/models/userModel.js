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
        required: true,
    },
    credits:{
        type:Number,
        default:500,
        min:0,
    },
    plan:{
        type:String,
        enum:["free","pro","enterprise"], default:"free",
    }
    }, { timestamps: true });

export const User = mongoose.model("User",userschema);