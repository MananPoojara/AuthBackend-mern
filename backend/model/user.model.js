import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastlogin: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },

    //here we don't need multiple value like we did in above fields so that's why don't make object for below fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationExpire: Date,

}, { timestamp: true })