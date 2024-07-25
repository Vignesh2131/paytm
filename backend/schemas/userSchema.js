const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
        trim :true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength:20,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 20,
        trim:true
    }, 
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength:6,
    }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);

module.exports = User