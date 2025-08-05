const Skill = require("../models/SkillModel"); 
const User = require('../models/User') 
const geminiValidateSkillTitle = require('../geminiAPI/geminiSkillTitleValidator')

const createSkill = async (req, res) => {
  try {
    const { title, useAI } = req.body;
    const userId = req.user._id;

    console.log('Request Body in createSkill : ', req.body);

    if (!title) {
      return res.status(400).json({ message: "Skill title is required" });
    }

    // Validate title using Gemini
    if (useAI) {
      const validity = await geminiValidateSkillTitle(title);
      if (validity === "INVALID") {
        return res
          .status(400)
          .json({
            message: `${title} is not Tech Relevant, enter a valid tech-related skill title.`,
          });
      }
    }

    // Check if skill already exists
    const existing = await Skill.findOne({ title, user: userId });
    if (existing) {
      console.log(`${title} already exists`);
      return res.status(400).json({ message: `${title} already exists` });
    }

    // Create skill
    const skill = new Skill({
      user: userId,
      title,
      modules: [], // No modules yet
    });

    console.log('Skill saved as blank card');
    await skill.save();

     // update user
    const user = await User.findById(userId);
    user.skillMetaData.push({
      skillId: skill._id,
      skillTitle: skill.title,
      progress: 0
    });
    console.log('User\'s Object after Skill creation : ', user);
    await user.save();
    
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
