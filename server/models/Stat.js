const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    value: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index: prevents duplicate athlete names per user
statSchema.index({ athleteId: 1, recordedAt: -1 });

module.exports = mongoose.model("Stat", statSchema);
