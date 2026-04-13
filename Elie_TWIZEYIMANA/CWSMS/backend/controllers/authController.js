const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const sanitizeUser = (user) => ({
  userId: user.UserId,
  fullName: user.FullName,
  email: user.Email,
  role: user.Role,
});

const register = async (req, res, next) => {
  try {
    const { FullName, Email, Password, Role } = req.body;
    if (!FullName || !Email || !Password) {
      return res.status(400).json({ success: false, message: "FullName, Email and Password are required" });
    }

    const existing = await userModel.getUserByEmail(Email);
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const PasswordHash = await bcrypt.hash(Password, 10);
    const insertId = await userModel.createUser({ FullName, Email, PasswordHash, Role });
    const createdUser = await userModel.getUserById(insertId);

    return res.status(201).json({ success: true, message: "User registered", data: sanitizeUser(createdUser) });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.getUserByEmail(Email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(Password, user.PasswordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.session.regenerate((regenError) => {
      if (regenError) {
        return next(regenError);
      }

      req.session.user = sanitizeUser(user);
      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.json({ success: true, message: "Login successful", data: req.session.user });
      });
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  if (!req.session) {
    return res.json({ success: true, message: "Logged out" });
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie("cwsms.sid");
    return res.json({ success: true, message: "Logged out" });
  });
};

const me = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  return res.json({ success: true, data: req.session.user });
};

module.exports = { register, login, logout, me };
