const { Note, Content } = require("../models/ContentModel");
const Skill = require("../models/SkillModel");

// GET: USER'S NOTES
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Inside getUserNotes');
    // fetch notes for this user
    const userNotes = await Note.find({ userId });

    // fetch all skills for this user in one go (avoid N queries)
    const skills = await Skill.find({ userId });

    // transform notes into desired shape
    const notesWithNames = userNotes.map((note) => {
      // find matching skill
      const skillDoc = skills.find(
        (skill) => skill._id.toString() === note.skillId.toString()
      );
      if (!skillDoc) return null;

      // find module
      const moduleDoc = skillDoc.modules.id(note.moduleId);
      if (!moduleDoc) return null;

      // find submodule
      const submoduleDoc = moduleDoc.submodules.id(note.submoduleId);
      if (!submoduleDoc) return null;

      return {
        _id: note._id.toString(),
        contentId: submoduleDoc.contentId
          ? submoduleDoc.contentId.toString()
          : null,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,

        userId: note.userId.toString(),
        skillId: note.skillId.toString(),
        moduleId: note.moduleId.toString(),
        submoduleId: note.submoduleId.toString(),

        skillName: skillDoc.title,
        moduleName: moduleDoc.title,
        submoduleName: submoduleDoc.title,
      };
    });

    console.log('User Notes : ', notesWithNames);

    // filter out nulls in case of broken refs
    return res.json(notesWithNames.filter(Boolean));
  } catch (error) {
    console.error("Could not get user's notes", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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

module.exports = {getUserNotes, deleteNote, updateNote};