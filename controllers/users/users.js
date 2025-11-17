const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/users/users");
const ErrorHandler = require("../../utils/errorHandler");
const { sendToken } = require("../../utils/jwtToken");

const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

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

module.exports = { registerUser, loginUser };
