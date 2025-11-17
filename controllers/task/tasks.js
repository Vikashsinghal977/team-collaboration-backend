const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Tasks = require("../../models/task/tasks");

// ✅ Create Task
exports.createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, status, projectId, assignedTo, teamsId } = req.body;

  if (!title) {
    return next(new ErrorHandler("Task title is required", 400));
  }

  const task = await Tasks.create({
    title,
    description,
    status,
    projectId,
    assignedTo,
    teamsId,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

// ✅ Get All Tasks (with filters, search, pagination)
exports.getAllTasks = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // 🔍 Search by field and text
  if (req.query.field && req.query.text) {
    const field = req.query.field;
    query[field] = { $regex: req.query.text, $options: "i" };
  }

  // 🎯 Filter by project
  if (req.query.projectId) {
    query.projectId = req.query.projectId;
  }

  // 🎯 Filter by team
  if (req.query.teamsId) {
    query.teamsId = req.query.teamsId;
  }

  // 🎯 Filter by user
  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo;
  }

  // 🎯 Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  const sortValue = { createdAt: -1 };

  const tasks = await Tasks.find(query)
    .populate("projectId", "name description")
    .populate("assignedTo", "name email")
    .populate("teamsId", "name description")
    .skip(skip)
    .limit(limit)
    .sort(sortValue);

  const totalCount = await Tasks.countDocuments(query);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
    page,
    tasks,
  });
});

// ✅ Get Single Task
exports.getSingleTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Tasks.findById(req.params.id)
    .populate("projectId", "name description")
    .populate("assignedTo", "name email")
    .populate("teamsId", "name description");

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  res.status(200).json({
    success: true,
    task,
  });
});

// ✅ Update Task
exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, status, projectId, assignedTo, teamsId } = req.body;

  let task = await Tasks.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (projectId !== undefined) task.projectId = projectId;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  if (teamsId !== undefined) task.teamsId = teamsId;

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

// ✅ Delete Task
exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Tasks.findById(req.params.id);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
