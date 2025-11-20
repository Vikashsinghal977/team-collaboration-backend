const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/users/users");
const ErrorHandler = require("../../utils/errorHandler");
const { sendToken } = require("../../utils/jwtToken");

const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, teamId, role } = req.body;

  // --- Validation ---
  if (!name?.trim()) {
    return next(new ErrorHandler("Name is required", 400));
  }

  if (!email?.trim()) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please provide a valid email address", 400));
  }

  if (!password || password.trim() === "" || password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password must match", 400)
    );
  }

  // --- Check for existing user ---
  let existingUser = await User.findOne({ email }).select("+password");

  if (existingUser && existingUser.isVerified) {
    return next(
      new ErrorHandler("A verified user already exists with this email", 400)
    );
  }

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.isDeactivated = false;
    await existingUser.save();
  } else {
    // --- Create new user ---
    existingUser = await User.create({
      name,
      email,
      password,
      teamId,
      role,
      isVerified: false,
      isDeactivated: false,
    });
  }

  // --- Optionally: generate token (if you want auto login after register) ---
  // const token = existingUser.getJWTToken();
  // res.status(201).json({ success: true, token });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});



// Login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  console.log("Email and Password", email, password)

  if (!email) {
    return next(
      new ErrorHandler("Please enter email as required for login", 400)
    );
  }

  if (!password) {
    return next(new ErrorHandler("Please enter password", 400));
  }

  let employee = await User.findOne({ email }).select("+password");

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found!!", 404));
  }


  const isPasswordMatched = await employee.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is not valid ", 401));
  }

  sendToken(employee, 200, res);

});


// Get All Users (with pagination, search, filters)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Search by name or description
  if (req.query.field && req.query.text) {
    const field = req.query.field;
    query[field] = { $regex: req.query.text, $options: "i" };
  }

  // // Filter by adminId
  if (req.query.teamId) {
    query.teamId = req.query.teamId;
  }

  const sortValue = { createdAt: -1 };

  const users = await User.find(query)
    .populate("teamId", "name email")
    .skip(skip)
    .limit(limit)
    .sort(sortValue);

  const totalCount = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
    page,
    users,
  });
});


const getSingleUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findById(req.params.id).populate("teamId", "name email");

  if (!users) {
    return next(new ErrorHandler("Users not found", 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
});

module.exports = { registerUser, loginUser, getAllUsers, getSingleUsers };
