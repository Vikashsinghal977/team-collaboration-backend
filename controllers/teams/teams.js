const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Teams = require("../../models/team/teams");

// ✅ Create Team
exports.createTeam = catchAsyncErrors(async (req, res, next) => {
  const { name, description, adminId } = req.body;

  if (!name) {
    return next(new ErrorHandler("Team name is required", 400));
  }

  const team = await Teams.create({
    name,
    description,
    adminId,
  });

  res.status(201).json({
    success: true,
    message: "Team created successfully",
    team,
  });
});

// ✅ Get All Teams (with pagination, search, filters)
exports.getAllTeams = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Search by name or description
  if (req.query.field && req.query.text) {
    const field = req.query.field;
    query[field] = { $regex: req.query.text, $options: "i" };
  }

  // Filter by adminId
  if (req.query.adminId) {
    query.adminId = req.query.adminId;
  }

  const sortValue = { createdAt: -1 };

  const teams = await Teams.find(query)
    .populate("adminId", "name email")
    .skip(skip)
    .limit(limit)
    .sort(sortValue);

  const totalCount = await Teams.countDocuments(query);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
    page,
    teams,
  });
});

// ✅ Get Single Team
exports.getSingleTeam = catchAsyncErrors(async (req, res, next) => {
  const teams = await Teams.findById(req.params.id).populate("adminId", "name email");

  if (!teams) {
    return next(new ErrorHandler("Team not found", 404));
  }

  res.status(200).json({
    success: true,
    teams,
  });
});

// ✅ Update Team
exports.updateTeam = catchAsyncErrors(async (req, res, next) => {
  const { name, description, adminId, active } = req.body;

  let teams = await Teams.findById(req.params.id);
  if (!teams) {
    return next(new ErrorHandler("Team not found", 404));
  }

  if (name !== undefined) teams.name = name;
  if (description !== undefined) teams.description = description;
  if (active!== null && active !== undefined) teams.active = active;

  await teams.save();

  res.status(200).json({
    success: true,
    message: "Team updated successfully",
    teams,
  });
});

// ✅ Delete Team
exports.deleteTeam = catchAsyncErrors(async (req, res, next) => {
  const team = await Teams.findById(req.params.id);

  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  await team.deleteOne();

  res.status(200).json({
    success: true,
    message: "Team deleted successfully",
  });
});
