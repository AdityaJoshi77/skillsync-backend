const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SIGNUP / REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log(req.body);
    const existing = await User.findOne({ email });
    console.log("The existing User : ", existing);
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, skillMetaData: [] });

    console.log("Registration successful : ", user);
    res.status(201).json({ user: { id: user._id, name, email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Registration Failed" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(req.body);
    console.log("Attempting login...");
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User Not Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    console.log("Login Successful ");

    // Set JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 hour
    });

    // send success response
    res.status(200).json({
      message: "Login Successful",
      user: { id: user._id, name: user.name, email, skillMetaData: user.skillMetaData },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Login Failed",
      error: `${error.message}`,
    });
  }
};

// LOG-OUT
// authController.js
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Expire now
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Not authorized" });
  }
};

module.exports = { register, login, logout, getMe };
