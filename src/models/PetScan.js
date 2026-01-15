const mongoose = require("mongoose");

const PetScanSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Types.ObjectId, ref: "Pet", required: true, index: true },
    ownerId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    scannedAt: { type: Date, default: Date.now, index: true },
    ip: String,
    userAgent: String,
    message: String,
    contact: String,
    source: { type: String, enum: ["qr", "nfc", "manual"], default: "qr" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PetScan", PetScanSchema);
