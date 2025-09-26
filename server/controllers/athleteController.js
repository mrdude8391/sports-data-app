const User = require("../models/User.js");
const Athlete = require("../models/Athete.js");
// jwt -> library to help with working with JSON web tokens: signing, verifying, decoding
const jwt = require("jsonwebtoken");

const createAthlete = async (req, res) => {
  try {
    console.log("createAthlete");
    const { name, age, height } = req.body;
    const userId = req.user._id;
    const athleteExists = await Athlete.findOne({ userId, name });
    if (athleteExists) {
      return res.status(400).json({ message: "Athlete name already exists" });
    }
    const athlete = await Athlete.create({
      userId,
      name,
      age,
      height,
    });
    res.status(201).json(athlete);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAthletes = async (req, res) => {
  try {
    console.log("getAthletes");
    const athletes = await Athlete.find({ userId: req.user._id });
    res.json(athletes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createAthlete, getAthletes };
