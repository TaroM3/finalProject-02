import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    user: String,
    message: String
})

const messageModel = mongoose.model('messages', messageSchema)

export default messageModel;