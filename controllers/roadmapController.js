require("dotenv").config();

const Skill = require("../models/SkillModel");
const {geminiGenerateRoadmap, geminiGenerateRoadmapDummy} = require("../geminiAPI/geminiRoadmapGenerator");
const dummyRoadmap = require("../dummyData/dummyRoadmap");
const populateSkillMetaData = require('../utils/populateSkillMetaData');
const User = require("../models/User");

const generateRoadmap_gemini = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Skill title is required" });
    }

    console.log("📥 Received title:", title);
    console.log("🚀 Calling geminiGenerateRoadmapDummy...");
    const modules = await geminiGenerateRoadmapDummy(title);
    // const modules = dummyRoadmap;

    // if modules generation somehow fails (parsing issue, etc)
    if (!Array.isArray(modules) || modules.length === 0) {
      console.log("⚠️ Gemini returned empty modules — treat as server error");
      return res
        .status(500)
        .json({ message: "Roadmap generation failed. Please try again." });
    }

    return res.status(200).json({
      roadmap: {
        title,
        modules,
      },
    });
  } catch (err) {
    console.error("❗ Error generating roadmap from Gemini:", err.message);
    return res.status(500).json({
      message: "Failed to generate roadmap. Try again later.",
    });
  }
};

// 1. Generate (but don't save)
const generateRoadmap_dummy = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      console.log(req.body);
      return res.status(400).json({ message: "Title required" });
    }

    // Dummy roadmap structure based on new schema
    console.log("Sending Dummy Roadmap : ", dummyRoadmap);

    res.status(200).json({ roadmap: dummyRoadmap });
  } catch (err) {
    console.error("Error generating roadmap:", err);
    res.status(500).json({ message: "Error generating roadmap" });
  }
};

// 2. Accept and Save
const acceptRoadmap = async (req, res) => {
  try {
    const { skillId, roadmap } = req.body;
    const userId = req.user._id;

    if (
      !skillId ||
      !roadmap ||
      !Array.isArray(roadmap) ||
      roadmap.length === 0
    ) {
      console.log("Request Body before accepting roadmap", req.body);
      return res
        .status(400)
        .json({ message: "Missing skillId or roadmap data" });
    }

    // Find the existing skill
    const skill = await Skill.findOne({ _id: skillId, user: userId });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Update modules field based on roadmap
    skill.modules = roadmap.map((module) => ({
      title: module.title,
      status: module.status,
      submodules: module.submodules.map((sub) => ({
        title: sub.title,
        type: sub.type,
        status: sub.status,
      })),
    }));
    
    if(Array.isArray(skill))
        console.log('skill object is an array');
    else
        console.log('Skill object is not an array');

    // FOR DEV PURPOSE: 
    const user = await User.findById(userId);    
    populateSkillMetaData(skill, user);


    console.log('Skill Progress : ', skill.progress);
    console.log('Module Progress : ', skill.modules.map((mod)=>mod.progress));
    await skill.save();
    console.log("Skill roadmap updated", skill);
    res.status(200).json({ message: "Skill roadmap updated", skill });
  } catch (err) {
    console.error("Error saving roadmap:", err);
    res.status(500).json({ message: "Error saving roadmap" });
  }
};

module.exports = {
  generateRoadmap_dummy,
  generateRoadmap_gemini,
  acceptRoadmap,
};
