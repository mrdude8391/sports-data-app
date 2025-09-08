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

const PORT = process.env.PORT;
// Start Express server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
