const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        index: true,
    },
    email:{
        type: String,
        default: null,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    teamId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teams"
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
},{
    timestamps: true,
})

// Method to Always Hash the Employee Password Before Saving in MongoDB
userSchema.pre("save", async function (next) {
  // Condition to check if the Password is not Change or Modified (Doesn't Hash the Already Hashed Password)
  if (!this.isModified("password")) {
    next();
  }
  // If the Password is Change or Modifed Updated New Hash Password
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function (platform) {
  return jwt.sign(
    { id: this._id, ...(platform && { platform }) },
    process.env.USER_JWT_SECRET,
    {
      expiresIn: process.env.USER_JWT_EXPIRE,
    }
  );
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Forget Password Token
userSchema.methods.getForgetPasswordToken = function () {
  // Generating Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and Adding forgotPasswordToken to the employee Schema
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.forgotPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // Expire after 5 mins
  return resetToken;
};

//Creating Index for Better Performance Optimization
userSchema.index({ email: true }, { unique: true });
userSchema.index({ phone: true });

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");
module.exports = User;
