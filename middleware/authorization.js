const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utilities/error");

const authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been suspended." });
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports = authorization;
