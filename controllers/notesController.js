
const {Note, Content} = require('../models/ContentModel');


// PUT : UPDATE A NOTE.
const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;

    // Optional: Check if the user is authorized to update this note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    return res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update note" });
  }
};

// DELETE: Delete a Note: 
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note to get its contentId for cleanup
    const noteToDelete = await Note.findById(noteId);
    if (!noteToDelete) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (noteToDelete.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Remove the note's ID from the corresponding Content document
    await Content.findByIdAndUpdate(noteToDelete.submoduleId, {
      $pull: { notes: noteId },
    });

    // Delete the note itself
    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete note" });
  }
};