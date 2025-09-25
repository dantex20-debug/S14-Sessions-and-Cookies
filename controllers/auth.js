const { loginUser } = require("../models/auth");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    loggedIn: req.session.loggedIn,
  });
};

// ! real user authentication will be implemented during the next course
exports.postLogin = async (req, res, next) => {
  const user = await loginUser(); // * logs in using set userID credentials

  req.session.user = user;
  req.session.loggedIn = true;
  req.session.save((err) => {
    if (err) throw new Error(err);
    res.redirect("/");
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
