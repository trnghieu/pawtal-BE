const Pet = require("../models/Pet");
const PetScan = require("../models/PetScan");
const User = require("../models/User");
const { sendPetScannedEmail } = require("../services/mail.service");

exports.getPublicPet = async (req, res) => {
  const pet = await Pet.findOne({ petCode: req.params.petCode })
    .select("petCode name species breed gender photos isLost lostStatus publicContactMode qr")
    .lean();

  if (!pet) return res.status(404).json({ message: "Pet not found" });
  res.json({ pet });
};

exports.createScan = async (req, res) => {
  const { petCode } = req.params;
  const { message, contact } = req.body || {};

  const pet = await Pet.findOne({ petCode });
  if (!pet) return res.status(404).json({ message: "Pet not found" });

  const scan = await PetScan.create({
    petId: pet._id,
    ownerId: pet.ownerId,
    scannedAt: new Date(),
    ip: req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    message,
    contact,
    source: "qr",
  });

  const owner = await User.findById(pet.ownerId).select("email fullName").lean();
  if (owner?.email) {
    const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
    const publicLink = `${base}/p/${pet.petCode}`;

    await sendPetScannedEmail({
      to: owner.email,
      ownerName: owner.fullName,
      petName: pet.name,
      petCode: pet.petCode,
      scan,
      publicLink,
      userId: pet.ownerId,
    });
  }

  res.status(201).json({ ok: true, scanId: scan._id });
};
