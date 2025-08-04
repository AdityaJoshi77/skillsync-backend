const mongoose = require("mongoose");

// Submodule schema: atomic units like "Learn Flexbox"
const subModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
});

// Module schema: a group like "Learn CSS"
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
});

// Skill schema: the entire learning goal, e.g., "Learn Web Development"
const skillSchema = new mongoose.Schema(
  {
    user: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);
