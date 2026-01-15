const router = require("express").Router();
const c = require("../controllers/public.controller");
const { scanLimiter } = require("../middleware/rateLimit");

router.get("/p/:petCode", c.getPublicPet);
router.post("/p/:petCode/scan", scanLimiter, c.createScan);

module.exports = router;
