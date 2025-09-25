const User = require("./user");

const newError = require("../utils/newError");
const required = require("../utils/requireEnvVar");

async function loginUser() {
  try {
    const userID = required("MONGODB_EXAMPLE_USER_ID");
    const user = await User.findById(userID);
    return user;
  } catch (error) {
    throw newError("Failed to login user", error);
  }
}

module.exports = { loginUser };
