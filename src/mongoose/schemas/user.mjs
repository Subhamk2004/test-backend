import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    username: {
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    firstname: {
        type:mongoose.Schema.Types.String,
        required:true
    },
    lastname: mongoose.Schema.Types.String,
    password: {
        type:mongoose.Schema.Types.String,
        required:true
    }
});

export let User = mongoose.model('User', userSchema);
