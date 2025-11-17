const express = require("express");
const { createMessage, getAllMessages, getSingleMessage, updateMessage, deleteMessage } = require("../../controllers/message/messages");


const router = express.Router();

// ✅ Create Message
router.post("/create", createMessage);

// ✅ Get All Messages
router.get("/get/all", getAllMessages);

// ✅ Get Single Message
router.get("/get/single/:id", getSingleMessage);

// ✅ Update Message
router.put("/update/:id", updateMessage);

// ✅ Delete Message
router.delete("/delete/:id", deleteMessage);

module.exports = router;
