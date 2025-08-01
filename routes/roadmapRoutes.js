

const express = require("express");
const router = express.Router();

const { generateRoadmap_dummy, generateRoadmap_gemini, acceptRoadmap } = require("../controllers/roadmapController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generateDummy", protect, generateRoadmap_dummy);
router.post('/generateGemini', protect, generateRoadmap_gemini);
router.post('/accept', protect, acceptRoadmap);

module.exports = router;
