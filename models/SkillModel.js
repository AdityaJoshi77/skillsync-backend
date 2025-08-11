// models/skill.js
const mongoose = require("mongoose");

// Submodule schema: atomic unit like "Learn Flexbox"
const subModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },

  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
  },

  type: {
    type: String,
    enum: ["Learning", "Practice", "Project"],
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },

  // Reference to the Content model
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    default: null,
  },
});

// Module schema: a group like "Learn CSS"
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },

  submodules: {
    type: [subModuleSchema],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  totalSubmodules: {
    type: Number,
    default: 0,
  },
  completedSubModules: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

// Skill schema: the entire learning goal, e.g., "Learn Web Development"
const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    modules: {
      type: [moduleSchema],
      required: true,
    },
    totalSubmodules: {
      type: Number,
      default: 0,
    },
    completedSubModules: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);
