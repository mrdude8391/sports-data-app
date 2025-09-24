const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

// Log to confirm API running on root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// use auth router
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);
// athlete router
const athleteRouter = require("./routes/athleteRoutes");
app.use("/athlete", athleteRouter);

const PORT = process.env.PORT;
// Start Express server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
