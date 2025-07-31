// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust the path if needed
require('dotenv').config();


const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token){
      console.log("Token not found");
      return res.status(401).json({ message: "Token Not Found" });
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


module.exports = { protect };
