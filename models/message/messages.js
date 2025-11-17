const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: {
        type:String,
        require: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    teamId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams"
    }
},{
    timestamps: true,
})


const Messages =
  mongoose.models.Messages || mongoose.model("Messages", messageSchema, "messages");
module.exports = Messages;