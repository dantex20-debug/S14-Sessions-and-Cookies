require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../../models/user");

const required = require("../../utils/requireEnvVar");
const newError = require("../../utils/newError");

// dummy User selector
const EXAMPLE_USER = {
  name: "Igor",
  email: "test@example.com",
  cart: {
    items: [],
  },
};

function buildAtlasUri() {
  const user = required("MONGO_USER");
  const pwd = required("MONGO_PASSWORD");
  const host = required("MONGO_HOST");
  const db = required("MONGO_DB");
  const appName = required("MONGO_APPNAME");

  return `mongodb+srv://${user}:${pwd}@${host}/${db}?retryWrites=true&w=majority&appName=${appName}`;
}

function getMongoDB_URI() {
  let uri;
  if (required("USE_MONGODB_ATLAS") === "true") uri = buildAtlasUri();
  else uri = required("MONGODB_URI");

  return uri;
}

// ensuring user with set ID exists
async function ensureUserExists() {
  const userID = required("MONGODB_EXAMPLE_USER_ID");
  const user = User.findById(userID);

  if (!user) {
    console.log("Example user not found. Creating user with ID", userID); // DEBUGGING
    user = await User.create({
      _id: userID,
      ...EXAMPLE_USER,
    });
  }
  return;
}

// * connecting to the 'shop' database using Mongoose
async function mongoConnect(callback) {
  try {
    ensureUserExists();

    const uri = getMongoDB_URI();
    if (typeof callback === "function") callback();

    return await mongoose.connect(uri);
  } catch (error) {
    throw newError(
      "An error occurred whilst trying to connect to MongoDB",
      error
    );
  }
}

function close() {
  return mongoose.connection.close();
}

module.exports = { mongoConnect, close, mongoose, getMongoDB_URI };
