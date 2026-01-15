const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/pet.controller");

router.use(auth);
router.post("/", c.createPet);
router.get("/", c.myPets);
router.patch("/:id/mark-lost", c.markLost);
router.patch("/:id/mark-found", c.markFound);

module.exports = router;
