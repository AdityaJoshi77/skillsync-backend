
require('dotenv').config();

const Skill = require("../models/SkillModel");
const generateRoadmapFromGemini = require('../utils/gemini')

const generateRoadmap_gemini = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    console.log('In generateRoadmap_gemini');
    // Call Gemini to generate the modules
    const modules = await generateRoadmapFromGemini(title);
    
    // Respond with preview
    return res.status(200).json({
      roadmap: {
        title,
        modules,
      },
    });
  } catch (err) {
    console.error("Error generating roadmap from Gemini:", err.message);
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
    const roadmap = [
      {
        title: `Learn fundamentals of ${title}`,
        submodules: [
          { title: `What is ${title}?`, type: "Learning", status: "Pending" },
          { title: `Why use ${title}?`, type: "Learning", status: "Pending" },
        ],
        status: "Pending",
      },
      {
        title: `Practice examples using ${title}`,
        submodules: [
          {
            title: `Simple ${title} programs`,
            type: "Practice",
            status: "Pending",
          },
          {
            title: `Intermediate exercises`,
            type: "Practice",
            status: "Pending",
          },
        ],
        status: "Pending",
      },
      {
        title: `Build a mini-project in ${title}`,
        submodules: [
          { title: `Project planning`, type: "Project", status: "Pending" },
          { title: `Build and test`, type: "Project", status: "Pending" },
        ],
        status: "Pending",
      },
    ];

    res.status(200).json({ roadmap });
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
      status: "Pending",
      submodules: module.submodules.map((sub) => ({
        title: sub.title,
        type: sub.type,
        status: "Pending",
      })),
    }));

    await skill.save();
    console.log("Skill roadmap updated", skill);
    res.status(200).json({ message: "Skill roadmap updated", skill });
  } catch (err) {
    console.error("Error saving roadmap:", err);
    res.status(500).json({ message: "Error saving roadmap" });
  }
};

module.exports = { generateRoadmap_dummy, generateRoadmap_gemini, acceptRoadmap };
