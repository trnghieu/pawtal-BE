const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Object, default: {} },
    status: { type: String, enum: ["queued", "sent", "failed"], default: "queued" },
    sentAt: Date,
    error: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
