const express = require("express");
const router = express.Router();
const { getProfileInfos,updateProfile,deleteProfile } = require("../controllers/user.controllers");
const ensureAuthenticated = require("../middlewares/auth.middleware");

//profile related routes
router.get("/profiles", ensureAuthenticated, getProfileInfos);
router.patch("/update-profile", ensureAuthenticated, updateProfile);
router.delete("/delete-profile/:userId", ensureAuthenticated, deleteProfile);

// upload images
const {
  uploadProfileImage,
  uploadAudioFile,
} = require("../middlewares/image.middleware");
const {
  postProfileImage,
  postMultipleImages,
  getMultipleImages,
  postAudioFile,
} = require("../controllers/user.controllers");

// router.get('/media-pages', getMediaPage)
router.post(
  "/upload/single_image",
  uploadProfileImage.single("profileImage"),
  postProfileImage
);
router.post(
  "/upload/multiple_image",
  uploadProfileImage.array("images", 5),
  postMultipleImages
);
router.get("/multiple_image", getMultipleImages);

router.post("/upload/audio", uploadAudioFile.single("audio"), postAudioFile);

module.exports = router;
