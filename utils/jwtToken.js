// Creating Token and Saving in Cookies

const sendToken = (employee, statusCode, res) => {
  const token = employee.getJWTToken();

  // Options for Cookies
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000),
  };

  employee = {
    ...employee?.toObject(),
    token,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    employee,
  });
};
const sendUserToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  // Options for Cookies
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000
      // Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };
  user = {
    ...user?.toObject(),
    token,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};

module.exports = { sendToken, sendUserToken };
