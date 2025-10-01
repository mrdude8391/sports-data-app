const User = require("../models/User.js");
const Athlete = require("../models/Athete.js");
// jwt -> library to help with working with JSON web tokens: signing, verifying, decoding
const jwt = require("jsonwebtoken");
const Stat = require("../models/Stat.js");

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

const deleteAthlete = async (req, res) => {
  try {
    console.log("deleteAthlete");
    const id = req.params.id;
    const athlete = await Athlete.findOne({ _id: id, userId: req.user._id });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }
    await athlete.deleteOne();
    res.status(200).json({ message: "Athlete deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createStat = async (req, res) => {
  try {
    console.log("add stat");
    const data = req.body;
    const athleteId = req.params.id;
    const userId = req.user._id;
    const stat = await Stat.create({
      userId: userId,
      athleteId: athleteId,
      ...data,
    });
    res.status(201).json(stat);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    console.log("get all stats");
    const athleteId = req.params.id;
    const stats = await Stat.find({ athleteId: athleteId });
    res.status(201).json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteStat = async (req, res) => {
  try {
    console.log("deleteStat");
    const statId = req.params.id;
    const stat = await Stat.findOne({ _id: statId, userId: req.user._id });

    if (!stat) {
      return res.status(404).json({ message: "Stat not found" });
    }
    await stat.deleteOne();
    res.status(200).json({ message: "Stat deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAthlete,
  getAthletes,
  deleteAthlete,
  getStats,
  createStat,
  deleteStat,
};
