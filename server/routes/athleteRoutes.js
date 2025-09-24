// declare express router
const express = require("express");
const router = express.Router();
// require the protect function to get ID
const { protect } = require("../middleware/authMiddleware");

const { createAthlete } = require("../controllers/athleteController");

router.post("/create", protect, createAthlete);

// export the router we have set up here
module.exports = router;
