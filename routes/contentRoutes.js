const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  generateArticles,
  generateVideos,
  getContentArticles,
  getContentVideos,
  getContentNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/contentController");

router.post("/generateArticles", protect, generateArticles);
router.post("/generateVideos", protect, generateVideos);
router.post("/createNote", protect, createNote);

router.get("/getPersistedArticles/:contentId", protect, getContentArticles);
router.get("/getPersistedVideos/:contentId", protect, getContentVideos);
router.get("/getPersistedNotes/:contentId", protect, getContentNotes);

router.put("/updateNote/:noteId", protect, updateNote);

router.delete("/deleteNote/:noteId", protect, deleteNote);

module.exports = router;
