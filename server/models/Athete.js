const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound index: prevents duplicate athlete names per user
athleteSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Athlete", athleteSchema);
