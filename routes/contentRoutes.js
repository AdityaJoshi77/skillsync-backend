const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  generateArticles,
  generateVideos,
} = require("../controllers/contentController");

router.post("/generatearticles", protect, generateArticles);
router.post("/generatevideos", protect, generateVideos);

module.exports = router;
