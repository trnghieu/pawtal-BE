const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    petCode: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ["dog", "cat", "other"], required: true },
    breed: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },

    photos: { type: [String], default: [] },

    isLost: { type: Boolean, default: false, index: true },
    lostStatus: {
      lostAt: Date,
      lostLocationText: String,
      lastSeenNote: String,
      reward: Number,
    },

    publicContactMode: {
      type: String,
      enum: ["show_phone", "hide_phone_form_only", "show_email", "form_only"],
      default: "hide_phone_form_only",
    },

    qr: {
      qrText: { type: String, required: true },
      qrImageUrl: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", PetSchema);
