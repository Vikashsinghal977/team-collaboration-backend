const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Projects = require("../../models/project/projects");

// ✅ Create Project
exports.createProject = catchAsyncErrors(async (req, res, next) => {
  const { name, description, teamId } = req.body;

  if (!name) {
    return next(new ErrorHandler("Project name is required", 400));
  }

  const project = await Projects.create({
    name,
    description,
    teamId,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

// ✅ Get All Projects
exports.getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Search by field and text
  if (req.query.field && req.query.text) {
    const field = req.query.field;
    query[field] = { $regex: req.query.text, $options: "i" };
  }

  // Filter by team
  if (req.query.teamId) {
    query.teamId = req.query.teamId;
  }

  const sortValue = { createdAt: -1 };

  const projects = await Projects.find(query)
    .populate("teamId", "name description")
    .skip(skip)
    .limit(limit)
    .sort(sortValue);

  const totalCount = await Projects.countDocuments(query);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
    page,
    projects,
  });
});

// ✅ Get Single Project
exports.getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Projects.findById(req.params.id).populate("teamId", "name description");

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  res.status(200).json({
    success: true,
    project,
  });
});

// ✅ Update Project
exports.updateProject = catchAsyncErrors(async (req, res, next) => {
  const { name, description, teamId, active } = req.body;

  let project = await Projects.findById(req.params.id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (active!== null && active !== undefined) project.active = active;
  if (teamId !== undefined) project.teamId = teamId;

  await project.save();

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

// ✅ Delete Project
exports.deleteProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Projects.findById(req.params.id);

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
