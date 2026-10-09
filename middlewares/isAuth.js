const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = protect;
