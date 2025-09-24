const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const User = require("./models/user");

const errorController = require("./controllers/error");

const { mongoConnect, getMongoDB_URI } = require("./src/db/database");
const ObjectId = require("mongodb").ObjectId;

const MongoDB_URI = getMongoDB_URI();

const app = express();
const store = new MongoDBStore({
  uri: MongoDB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const required = require("./utils/requireEnvVar");
const catchErrAsync = require("./utils/catchErrAsync");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: required("SESSION_HASH"),
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {}
  })
);

// dummy User selector
const USER_ID = new ObjectId("68c59cebf2b7f6e17ff9ea08");
const EXAMPLE_USER = {
  name: "Igor",
  email: "test@example.com",
  cart: {
    items: [],
  },
};

// ! user authentication will be implemented in the future
app.use(
  catchErrAsync(async (req, res, next) => {
    let user = await User.findById(USER_ID);
    if (!user) {
      user = await User.create({
        _id: USER_ID,
        ...EXAMPLE_USER,
      });
    }
    req.user = user;
    next();
  })
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
app.use(errorController.getErrorPage);

// ^ setting up MongoDB connection
mongoConnect(() => {
  app.listen(3000);
});
