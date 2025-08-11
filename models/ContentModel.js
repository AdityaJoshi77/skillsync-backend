// models/content.js
const mongoose = require("mongoose");

// Note schema
const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

// Article schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  summary: { type: String, default: "" },
});

// Content schema
const contentSchema = new mongoose.Schema({
  youtubeLinks: { type: [String], default: [] },

  // Array of references to Article documents
  articles: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    default: [],
  },

  // Array of references to Note documents
  notes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    default: [],
  },
});

// Export models
module.exports = {
  Content: mongoose.model("Content", contentSchema),
  Note: mongoose.model("Note", noteSchema),
  Article: mongoose.model("Article", articleSchema),
};
