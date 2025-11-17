const express = require("express");
const { createTeam, getAllTeams, getSingleTeam, updateTeam, deleteTeam } = require("../../controllers/teams/teams");


const router = express.Router();

// ✅ Create Team
router.post("/create", createTeam);

// ✅ Get All Teams
router.get("/get/all", getAllTeams);

// ✅ Get Single Team
router.get("/get/single/:id", getSingleTeam);

// ✅ Update Team
router.put("/update/:id", updateTeam);

// ✅ Delete Team
router.delete("/delete/:id", deleteTeam);

module.exports = router;
