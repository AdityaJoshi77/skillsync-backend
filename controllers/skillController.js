const Skill = require("../models/SkillModel");
const User = require("../models/User");
const geminiValidateSkillTitle = require("../geminiAPI/geminiSkillTitleValidator");

const createSkill = async (req, res) => {
  try {
    const { title, useAI } = req.body;
    const userId = req.user._id;

    console.log("Request Body in createSkill : ", req.body);

    if (!title) {
      return res.status(400).json({ message: "Skill title is required" });
    }

    // Validate title using Gemini
    if (useAI) {
      const validity = await geminiValidateSkillTitle(title);
      if (validity === "INVALID") {
        return res.status(400).json({
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
      userId,
      title,
      modules: [], // No modules yet
    });

    // update user's skill MetaData
    const user = await User.findById(userId);
    user.skillMetaData.push({
      skillId: skill._id,
      title: skill.title,
      progress: 0,
    });

    console.log("Skill saved as blank card");
    await skill.save();

    console.log("User's Object after Skill creation : ", user);
    await user.save();

    res.status(201).json(skill);
  } catch (error) {
    console.error("Error creating skill:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET : GET ALL SKILLS OF A USER
const getUserSkills = async (req, res) => {
  try {
    const userId = req.user._id;

    const skills = await Skill.find({ userId });

    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "No skills for current user" });
    }

    res.status(200).json(skills);
  } catch (error) {
    console.error("Error getting user skills:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: GET A USER SKILL BY SKILL'S ID
const getUserSkillById = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!skillId)
      return res
        .status(400)
        .json({ message: "Cannot get Skill. Missing skillId" });

    const skill = await Skill.findById(skillId);
    if (!skill)
      return res
        .status(404)
        .json({ message: "Skill Not Found, Invalid SkillId" });

    if (skill.userId.toString() !== req.user._id.toString())
      return res
        .status(404)
        .json({ message: "Skill not found; Invalid userId" });

    res.status(200).json(skill);
  } catch (error) {
    console.error("Error getting skill by id : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT: UPDATE PROGRESS COUNT OF SKILL
const updateSkillProgress = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { moduleId, subModuleId, updation } = req.body;
    const userId = req.user._id;

    console.log('In updateSkillProgress() ');

    const skill = await Skill.findById(skillId);
    if (!skill)
      return res
        .status(404)
        .json({ message: "Skill Not Found, Invalid SkillId" });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User Not Found, Invalid userId" });

    // find the target Submodule in the skill and update it with the updation passed in req.body.
    const targetModule = skill.modules.find(
      (mod) => mod._id.toString() === moduleId
    );
    const targetSubModule = targetModule.submodules.find(
      (sub) => sub._id.toString() === subModuleId
    );
    targetSubModule.status = updation;

    // Recount the count of completed Submodules in the target Module and the skill
    // Wrong method for the task :
    /*
          if (updation === "Completed") {
            targetModule.completedSubModules += 1;
            skill.completedSubModules += 1;
          } else {
            targetModule.completedSubModules -= 1;
            skill.completedSubModules -= 1;
          }

          Reason : This approach is fragile. If, say, two API calls come in parallel, or a prior bug causes mismatched counts, your progress becomes wrong over time.
    */

    targetModule.completedSubModules = targetModule.submodules.filter(
      (sub) => sub.status === "Completed"
    ).length;

    skill.completedSubModules = skill.modules.reduce((total, mod) => {
      return (
        total +
        mod.submodules.filter((sub) => sub.status === "Completed").length
      );
    }, 0);

    // Update the progress value of the skill and the target Module
    targetModule.progress = Math.floor(
      (targetModule.completedSubModules / targetModule.totalSubmodules) * 100
    );
    skill.progress = Math.floor(
      (skill.completedSubModules / skill.totalSubmodules) * 100
    );

    // persist skill changes in the db;
    await skill.save();

    // update user's skill Meta data:
    for (let i = 0; i < user.skillMetaData.length; i++) {
      if (user.skillMetaData[i].skillId.toString() === skillId.toString()) {
        user.skillMetaData[i].progress = skill.progress;
        break;
      }
    }

    // persist skill changes in the db;
    await user.save();

    res
      .status(200)
      .json({ message: "Skill Progress Updation Successful", skill });
  } catch (error) {
    console.error("Error Updating skill progress :", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE : DELETE SKILL
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.user._id;

    const skill = await Skill.findOne({ _id: skillId, userId: userId });

    if (!skill) {
      return res
        .status(404)
        .json({ message: "Skill not found or user unauthorized" });
    }

    // Remove the deleted skill's metadata from the current user's skillMetaData.
    const user = await User.findById(userId);

    user.skillMetaData = user.skillMetaData.filter(
      (skill) => skill.skillId.toString() !== skillId
    );

    // make the new changes persist.
    await user.save();
    await skill.deleteOne();

    console.log(
      "User's skillMetaData after Skill Deletion",
      user.skillMetaData
    );
    console.log(`Id of ${skill.title} : `, skillId);

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSkill,
  getUserSkills,
  getUserSkillById,
  deleteSkill,
  updateSkillProgress,
};
