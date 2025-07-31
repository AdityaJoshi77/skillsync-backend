const Task = require("../models/TaskModel");


// POST : CREATE TASKS
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id; // Assuming authentication middleware sets req.user

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = new Task({
      user: userId,
      title,
      subtasks: [], // No subtasks for now
      status: "Pending",
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET : GET USER TASKS
const getUserTasks = async (req, res) => {
  try {
    const {userId} = req.params;
    const tasks = await Task.find({ user: userId });
    if(!tasks)
        return res.status(404).json({message: 'No tasks for current user'});
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.log('Error getting user tasks : ', error);
    res.status(500).json({message: 'Interval Server Error'});
  }
}

// DELETE : DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id; // From protect middleware

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      console.log('Task to be deleted not found');
      return res.status(404).json({ message: "Task not found or user unauthorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createTask, getUserTasks, deleteTask };
