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
router.route("/create").post(createProject);

// ✅ Get All Projects
router.route("/get/all").get(getAllProjects);

// ✅ Get Single Project
router.route("/get/single/:id").get(getSingleProject);

// ✅ Update Project
router.route("/update/:id").put(updateProject);

// ✅ Delete Project
router.route("/delete/:id").delete(deleteProject);

module.exports = router;
