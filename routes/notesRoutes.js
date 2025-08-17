
const express = require('express');
const router = express.Router();

const {getUserNotes} = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/getUserNotes', protect, getUserNotes);

module.exports = router;
