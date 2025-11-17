const express = require("express");
const {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../../controllers/project/projects");

const router = express.Router();

// ✅ Create Project
router.post("/create", createProject);

// ✅ Get All Projects
router.get("/get/all", getAllProjects);

// ✅ Get Single Project
router.get("/get/single/:id", getSingleProject);

// ✅ Update Project
router.put("/update/:id", updateProject);

// ✅ Delete Project
router.delete("/delete/:id", deleteProject);

module.exports = router;
