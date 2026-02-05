// Elegant MongoDB object modeling for Node.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection error", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
