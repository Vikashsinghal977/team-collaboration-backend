const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../../controllers/users/users");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get/all").get(getAllUsers);


module.exports = router;