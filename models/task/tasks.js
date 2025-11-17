const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {
        type:String,
        required: true
    },
    description: {
        type:String
    },
    status:{
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    teamsId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams"
    }
})


const Tasks =
  mongoose.models.Tasks || mongoose.model("Tasks", taskSchema, "tasks");
module.exports = Tasks;