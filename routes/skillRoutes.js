const express = require("express");
const router = express.Router();
const {createSkill, getUserSkills, deleteSkill} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware"); // assumes user is authenticated

router.post("/", protect, createSkill);
router.get("/:userId", protect, getUserSkills);
router.delete("/:skillId", protect, deleteSkill);

module.exports = router;
