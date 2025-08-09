const express = require("express");
const router = express.Router();
const {createSkill, getUserSkills, getUserSkillById ,deleteSkill, updateSkillProgress} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware"); // assumes user is authenticated

router.post("/", protect, createSkill);
router.get("/", protect, getUserSkills);
router.get("/:skillId", protect, getUserSkillById)
router.put('/:skillId', protect, updateSkillProgress)
router.delete("/:skillId", protect, deleteSkill);

module.exports = router;
