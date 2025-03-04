const express = require("express");
const upload = require("../middlewares/upload");
const petController = require("../controllers/petController");

const router = express.Router();

router.get("/", petController.getAllPets);
router.get("/add", petController.showAddPetForm);
router.post("/add", upload.single("image"), petController.addPet);
router.post("/adopt/:id", petController.updateAdoptionStatus);
router.post("/delete/:id", petController.deletePet);

module.exports = router;
