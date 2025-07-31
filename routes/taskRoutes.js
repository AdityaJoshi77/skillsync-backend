
const express = require("express");
const router = express.Router();
const { createTask, getUserTasks, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware"); // assumes user is authenticated

router.post("/", protect, createTask);
router.get("/:userId", protect, getUserTasks);
router.delete("/:taskId", protect, deleteTask);


module.exports = router;
