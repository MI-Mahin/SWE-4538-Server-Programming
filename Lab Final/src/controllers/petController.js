const Pet = require("../models/petModel");


exports.getAllPets = async (req, res) => {
  const pets = await Pet.find();
  res.render("index", { pets });
};


exports.showAddPetForm = (req, res) => {
  res.render("addPet");
};


exports.addPet = async (req, res) => {
  const { name, species, age, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const newPet = new Pet({ name, species, age, description, image });
  await newPet.save();
  res.redirect("/");
};


exports.updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndUpdate(id, { isAdopted: true });
  res.redirect("/");
};


exports.deletePet = async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndDelete(id);
  res.redirect("/");
};
