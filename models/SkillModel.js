const mongoose = require("mongoose");


// notes schema: a note made for a submodule
const notesSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },

  content:{
    type:String,
    default: "",
  }
})

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

  content: {
    youtubeLinks:{
      type: [String],
      default: [],
    },
    articleLinks:{
      type:[String],
      default: [],
    },
    aiSummary: {
      type: String,
      default: "",
    }
  },

  notes:{
    type:[notesSchema],
    default:[]
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
