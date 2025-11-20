const express = require("express");
const { createTeam, getAllTeams, getSingleTeam, updateTeam, deleteTeam } = require("../../controllers/teams/teams");


const router = express.Router();

// ✅ Create Team
router.route("/create").post(createTeam);

// ✅ Get All Teams
router.route("/get/all").get(getAllTeams);

// ✅ Get Single Team
router.get("/get/single/:id", getSingleTeam);

// ✅ Update Team
router.route("/update/:id").put(updateTeam);

// ✅ Delete Team
router.route("/delete/:id").delete(deleteTeam);

module.exports = router;
