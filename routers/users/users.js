const express = require("express");
const { registerUser, loginUser, getAllUsers, getSingleUsers } = require("../../controllers/users/users");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get/all").get(getAllUsers);
router.route("/get/all").get(getAllUsers);
router.route("/get/single/:id").get(getSingleUsers);


module.exports = router;