// declare express router
const express = require("express");
const router = express.Router();
// require the protect function to get ID
const { protect } = require("../middleware/authMiddleware");

const {
  createAthlete,
  getAthletes,
} = require("../controllers/athleteController");

router.post("/create", protect, createAthlete);
router.get("/", protect, getAthletes);

// export the router we have set up here
module.exports = router;
