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
    attack: {
      kills: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    setting: {
      assists: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
    serving: {
      rating: { type: Number, default: 0 },
      aces: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    receiving: {
      rating: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
    },
    defense: {
      digs: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
    },
    blocking: {
      total: { type: Number, default: 0 },
      kills: { type: Number, default: 0 },
      solos: { type: Number, default: 0 },
      goodTouches: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index: prevents duplicate athlete names per user
statSchema.index({ athleteId: 1, recordedAt: -1 });

module.exports = mongoose.model("Stat", statSchema);
