const Skill = require("../models/SkillModel"); // renamed model

// POST : CREATE SKILL (equivalent to creating a Task)
const createSkill = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    if (!title) {
      return res.status(400).json({ message: "Skill title is required" });
    }

    const existing = await Skill.findOne({ title });
    if (existing) {
      console.log(`${title} already exists`);
      return res.status(400).json({ message: `${title} already exists` });
    }

    const skill = new Skill({
      user: userId,
      title,
      modules: [], // No modules yet, only title
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error("Error creating skill:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET : GET USER SKILLS
const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await Skill.find({ user: userId });

    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "No skills for current user" });
    }

    res.status(200).json(skills);
  } catch (error) {
    console.error("Error getting user skills:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE : DELETE SKILL
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.user._id;

    const skill = await Skill.findOne({ _id: skillId, user: userId });

    if (!skill) {
      return res
        .status(404)
        .json({ message: "Skill not found or user unauthorized" });
    }

    await skill.deleteOne();

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSkill,
  getUserSkills,
  deleteSkill,
};
