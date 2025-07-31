const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
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
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
});

const taskSchema = new mongoose.Schema(
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
    subtasks: [subTaskSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);