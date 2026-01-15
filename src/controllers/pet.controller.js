const Pet = require("../models/Pet");
const { generatePetCode } = require("../utils/generateCode");
const { makeQrAndUpload } = require("../services/qr.service");

exports.createPet = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { name, species, breed, gender, photos } = req.body;

    // validate tối thiểu
    if (!name || !species) {
      return res.status(400).json({ message: "name và species là bắt buộc" });
    }

    // generate unique petCode
    let petCode = null;
    for (let i = 0; i < 5; i++) {
      const code = generatePetCode();
      const exists = await Pet.exists({ petCode: code });
      if (!exists) { petCode = code; break; }
    }
    if (!petCode) return res.status(500).json({ message: "Cannot generate petCode" });

    const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
    if (!base) return res.status(500).json({ message: "Missing APP_BASE_URL in .env" });

    const qrText = `${base}/p/${petCode}`;

    const qrImageUrl = await makeQrAndUpload({ qrText, publicId: petCode });

    const pet = await Pet.create({
      ownerId,
      petCode,
      name,
      species,
      breed,
      gender,
      photos: photos || [],
      qr: { qrText, qrImageUrl },
    });

    return res.status(201).json({ pet });
  } catch (err) {
    console.error("CREATE_PET_ERROR:", err?.message);
    console.error(err); // in full stack
    return res.status(500).json({
      message: err?.message || "Internal server error",
      // bật khi dev để thấy rõ:
      stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
    });
  }
};


exports.myPets = async (req, res) => {
  const pets = await Pet.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ pets });
};

exports.markLost = async (req, res) => {
  const { id } = req.params;
  await Pet.findOneAndUpdate(
    { _id: id, ownerId: req.user.userId },
    { isLost: true, lostStatus: { lostAt: new Date() } },
    { new: true }
  );
  res.json({ ok: true });
};

exports.markFound = async (req, res) => {
  const { id } = req.params;
  await Pet.findOneAndUpdate(
    { _id: id, ownerId: req.user.userId },
    { isLost: false, lostStatus: {} },
    { new: true }
  );
  res.json({ ok: true });
};
