const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type:String
    },
    description: {
        type:String
    },
    adminId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true,
})


const Teams =
  mongoose.models.Teams || mongoose.model("Teams", teamSchema, "teams");
module.exports = Teams;