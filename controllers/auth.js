exports.getLogin = (req, res, next) => {
  console.log("Session `loggedIn` cookie:", req.session.loggedIn); // DEBUGGING
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    loggedIn: req.session.loggedIn,
  });
};

// ! real user authentication will be implemented during the next course
exports.postLogin = (req, res, next) => {
  req.session.loggedIn = true;
  res.redirect("/");
};
