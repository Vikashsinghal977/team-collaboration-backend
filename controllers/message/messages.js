const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Messages = require("../../models/message/messages");

// ✅ Create Message
exports.createMessage = catchAsyncErrors(async (req, res, next) => {
  const { content, senderId, teamId } = req.body;

  if (!content) {
    return next(new ErrorHandler("Message content is required", 400));
  }

  const message = await Messages.create({
    content,
    senderId,
    teamId,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

// ✅ Get All Messages (with filters + pagination)
exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = {};

  // 🔍 Search by text
  if (req.query.text) {
    query.content = { $regex: req.query.text, $options: "i" };
  }

  // 🎯 Filter by team
  if (req.query.teamId) {
    query.teamId = req.query.teamId;
  }

  // 🎯 Filter by sender
  if (req.query.senderId) {
    query.senderId = req.query.senderId;
  }

  const sortValue = { createdAt: -1 };

  const messages = await Messages.find(query)
    .populate("senderId", "name email")
    .populate("teamId", "name description")
    .skip(skip)
    .limit(limit)
    .sort(sortValue);

  const totalCount = await Messages.countDocuments(query);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
    page,
    messages,
  });
});

// ✅ Get Single Message
exports.getSingleMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Messages.findById(req.params.id)
    .populate("senderId", "name email")
    .populate("teamId", "name description");

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  res.status(200).json({
    success: true,
    message: message,
  });
});

// ✅ Update Message
exports.updateMessage = catchAsyncErrors(async (req, res, next) => {
  const { content, senderId, teamId } = req.body;

  let message = await Messages.findById(req.params.id);
  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  if (content !== undefined) message.content = content;
  if (senderId !== undefined) message.senderId = senderId;
  if (teamId !== undefined) message.teamId = teamId;

  await message.save();

  res.status(200).json({
    success: true,
    message: "Message updated successfully",
    data: message,
  });
});

// ✅ Delete Message
exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Messages.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
