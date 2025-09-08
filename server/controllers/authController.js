const User = require("../models/User.js");
// bcrypt encryption library to help hash passwords
const bcrypt = require("bcryptjs");
// jwt -> library to help with working with JSON web tokens: signing, verifying, decoding
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // if user exists return 400
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // generate token
    const token = generateToken(user._id);
    // return user info and token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser };
