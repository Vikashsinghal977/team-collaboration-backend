const express = require("express");
const {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../../controllers/task/tasks");

const router = express.Router();

// ✅ Create Task
router.post("/create", createTask);

// ✅ Get All Tasks
router.get("/get/all", getAllTasks);

// ✅ Get Single Task
router.get("/get/single/:id", getSingleTask);

// ✅ Update Task
router.put("/update/:id", updateTask);

// ✅ Delete Task
router.delete("/delete/:id", deleteTask);

module.exports = router;
