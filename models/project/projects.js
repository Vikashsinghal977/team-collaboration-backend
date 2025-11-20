const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type:String
    },
    description: {
        type:String
    },
    active: {
        type: Boolean,
        default: false
    },
    teamId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams"
    }
},{
    timestamps: true,
})


const Projects =
  mongoose.models.Projects || mongoose.model("Projects", projectSchema, "projects");
module.exports = Projects;