const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  generateArticles,
  generateVideos,
  getContentArticles,
  getContentVideos,
} = require("../controllers/contentController");

router.post("/generatearticles", protect, generateArticles);
router.post("/generatevideos", protect, generateVideos);
router.get("/getpersistedarticles/:contentId", protect, getContentArticles);
router.get("/getpersistedvideos/:contentId", protect, getContentVideos);

module.exports = router;
