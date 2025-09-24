require("dotenv").config();
const mongoose = require("mongoose");

const required = require("../../utils/requireEnvVar");
const newError = require("../../utils/newError");

function buildAtlasUri() {
  const user = required("MONGO_USER");
  const pwd = required("MONGO_PASSWORD");
  return `mongodb+srv://${user}:${pwd}@nodejs-course.tvid3w8.mongodb.net/s14-shop?retryWrites=true&w=majority&appName=NodeJS-Course`;
}

function getMongoDB_URI() {
  let uri;
  if (required("USE_MONGODB_ATLAS") === "true") uri = buildAtlasUri();
  else uri = required("MONGODB_URI");

  return uri;
}

// * connecting to the 'shop' database using Mongoose
async function mongoConnect(callback) {
  try {
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
