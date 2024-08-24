import mongoose from "mongoose";

let discordUserSchema = new mongoose.Schema({
    username: {
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    discordId: {
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    }
});

export let discordUser = mongoose.model('discordUser', discordUserSchema);
