const Athlete = require("../models/Athete.js");
const Stat = require("../models/Stat.js");
const mongoose = require("mongoose");

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
    const athleteId = req.params.id;
    console.log("get stats: find athlete");
    const athlete = await Athlete.findById(athleteId);
    if (!athlete) {
      console.log("not found");
      return res.status(404).json({ message: "Athlete not found" });
    }
    console.log("get all stats");
    const stats = await Stat.find({ athleteId: athleteId }).sort({
      recordedAt: -1,
    });

    res.status(201).json({ athlete, stats });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const deleteStat = async (req, res) => {
  try {
    console.log("deleteStat");
    const statId = req.params.id;
    const userId = req.user._id;
    const stat = await Stat.findOne({ _id: statId, userId: userId });

    if (!stat) {
      return res.status(404).json({ message: "Stat not found" });
    }
    await stat.deleteOne();
    res.status(200).json({ message: "Stat deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const editStat = async (req, res) => {
  try {
    console.log("editStat");
    const statId = req.params.id;
    const userId = req.user._id;
    const stat = await Stat.findOne({ _id: statId, userId: userId });
    if (!stat) {
      return res.status(404).json({ message: "Stat not found" });
    }
    const data = req.body;
    const updated = await stat.updateOne(data);
    res.status(200).json({ updated });
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
  editStat,
};
