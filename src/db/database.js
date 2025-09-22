require("dotenv").config();
const mongoose = require("mongoose");

const newError = require("../../utils/newError");

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing .env var: ${name}`);
  return v;
}

function buildAtlasUri() {
  const user = required("MONGO_USER");
  const pwd = required("MONGO_PASSWORD");
  return `mongodb+srv://${user}:${pwd}@nodejs-course.tvid3w8.mongodb.net/s14-shop?retryWrites=true&w=majority&appName=NodeJS-Course`;
}

// * connecting to the 'shop' database using Mongoose
async function mongoConnect(callback) {
  try {
    let uri;
    if (process.env.USE_MONGODB_ATLAS === "true") uri = buildAtlasUri();
    else uri = process.env.MONGODB_URI;

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

module.exports = { mongoConnect, close, mongoose };
