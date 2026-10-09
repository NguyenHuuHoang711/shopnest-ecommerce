const protect = require("../middlewares/isAuth.js");

const adminOnly = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin || req.user.role === "User") {
      const error = new Error("Not authorized as admin");
      error.statusCode = 403;
      return next(error);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = adminOnly;
